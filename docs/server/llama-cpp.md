# llama.cpp 部署与验证

> 阶段①的完整过程：编译 → 起服务 → 验证三步。记录于 2026-09-27。

## 它是什么

`llama.cpp` 是用 C/C++ 写的大语言模型**推理引擎**（2023 年由 Georgi Gerganov 开源）。

名字里的 `llama` 是历史包袱——它最初只服务 LLaMA 一个模型家族，后来支持的模型越来越多，名字没再改。**它跟训练无关，只管把训好的模型高效跑起来。**

三板斧：

1. **量化 + GGUF**：把 16 位权重压到 4 位上下，体积和显存都大砍。
2. **轻**：几乎无外部依赖，编译出单个可执行文件；CPU 能跑，CUDA 也能加速。
3. **`llama-server`**：一个 HTTP 服务，接口对齐 OpenAI，所以 Agent 能像调 OpenAI 一样调它。

## 为什么需要它

阶段②要手搓 Agent，Agent 得有"脑子"可调。而手搓的重点之一是 **function calling**，正好由 `llama-server --jinja` 这一层直接控制。

所以阶段①的验收就一句话：服务器上有一个 OpenAI 兼容端点，本地能调通。

> 注意：「OpenAI 兼容」指的是**接口格式**（`/v1/chat/completions`、`messages`、`tools`），不是 OpenAI 这家公司的服务。模型是本地的通义千问，不联网、不花钱。

## 服务器档案

| 项 | 值 |
|---|---|
| 接入 | SSH，`<host>:<port>`（真实地址另存本地，**不进仓库**） |
| 系统 | Ubuntu 24.04.5 LTS，x86_64 |
| CPU / 内存 | 28 核 / 31 GiB |
| GPU | RTX 3080 20 GB，驱动 580.178.04 |
| CUDA | 13.0.88，在 `/usr/local/cuda/bin`（**不在 PATH**） |
| 磁盘 | `/` 233 G，余 163 G |
| 模型 | `/srv/models/Qwen3.8-27B/Qwen3.8-27B-UD-IQ4_XS.gguf`，13.3 GiB |
| 已有服务 | ollama 跑在 `127.0.0.1:11435` |

模型自报的身份：**27.3B 参数**，量化 `IQ4_XS - 4.25 bpw`，词表 248,320，
原生上下文 **262,144（256K）**，带着额外的 MTP 层（llama.cpp 不启用，忽略）。

## 怎么做

### 一、拿源码

GitHub 的连通**时好时坏**——同一个地址，`curl` 测会超时（`http_code=000`），`git ls-remote` 却能拿到 ref。所以先直连试一次，不通再换镜像：

```bash
# 先试直连
git clone --depth 1 https://github.com/ggml-org/llama.cpp ~/projects/llama.cpp

# 不行再换镜像
git clone --depth 1 https://gitclone.com/github.com/ggml-org/llama.cpp ~/projects/llama.cpp
```

当前快照：commit `81bc6b8`，tag **b11200**。

### 二、编译

```bash
cd ~/projects/llama.cpp

cmake -B build \
  -DCMAKE_BUILD_TYPE=Release \
  -DGGML_CUDA=ON \
  -DCMAKE_CUDA_COMPILER=/usr/local/cuda/bin/nvcc \
  -DCMAKE_CUDA_ARCHITECTURES=86

nohup cmake --build build -j 12 > ~/logs/build.log 2>&1 &
tail -f ~/logs/build.log
```

参数逐个说：

| 参数 | 作用 |
|---|---|
| `-B build` | 构建产物丢进 `build/`，源码保持干净 |
| `-DCMAKE_BUILD_TYPE=Release` | 开 `-O3` 优化，否则白瞎一块 3080 |
| `-DGGML_CUDA=ON` | 启用 CUDA 后端，用上显卡 |
| `-DCMAKE_CUDA_COMPILER=...` | 指定 nvcc 绝对路径（因为在 PATH 里找不到） |
| `-DCMAKE_CUDA_ARCHITECTURES=86` | 目标 `sm_86`，即 RTX 3080（Ampere） |

`-j 12` 而不是 28 的原因：`nvcc` 单进程能吃 2~3 GB 内存，并行数给满会 OOM。降档重来时，`ccache` 会兜住已编译的部分。

**编译与构建是两回事**：`cmake -B build` 只做环境探测并生成构建文件（`Makefile`/`build.ninja`），`cmake --build` 才真的编译。

### 三、起服务

```bash
mkdir -p ~/logs

nohup ./build/bin/llama-server \
  -m /srv/models/Qwen3.8-27B/Qwen3.8-27B-UD-IQ4_XS.gguf \
  -c 16384 -ngl 99 --host 127.0.0.1 --port 8080 --jinja \
  > ~/logs/llama-server.log 2>&1 &

tail -f ~/logs/llama-server.log
```

| 参数 | 作用 |
|---|---|
| `-m <path>` | 模型文件 |
| `-c 16384` | 上下文长度。显存有余可往上加（原生支持 256K） |
| `-ngl 99` | 所有层放 GPU |
| `--host 127.0.0.1` | 只监听本机（外部访问要用端口转发） |
| `--port 8080` | 避开 ollama 的 11435 |
| `--jinja` | 用模型自带的 chat template，**function calling 的关键** |

日志里出现 `listening on http://127.0.0.1:8080` 就算起来了。加载 13.3 GiB 权重约需 13 秒。

> `unused tensor blk.64.*` 那批警告无害——模型带了额外的 MTP 层，llama.cpp 用不上，忽略。

### 四、验证

```bash
# 1) 模型列表
curl -s http://127.0.0.1:8080/v1/models

# 2) 会不会说话
curl -s http://127.0.0.1:8080/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"用一句话说明你是谁"}],"max_tokens":64}'

# 3) 会不会伸手要工具（关键）
curl -s http://127.0.0.1:8080/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"北京现在几点？"}],"tools":[{"type":"function","function":{"name":"get_time","description":"查询指定城市的当前时间","parameters":{"type":"object","properties":{"city":{"type":"string"}},"required":["city"]}}}],"tool_choice":"auto","max_tokens":128}'
```

第 3 条返回 `finish_reason: "tool_calls"`，且 `arguments` 是 `{"city":"北京"}`，说明 `--jinja` 这条路通了。

实测速度：生成约 **38.5 token/秒**，显存占用 14837 / 20480 MiB。

### 五、停服务

```bash
pkill llama-server

# 确认
pgrep -af llama-server                            # 无输出 = 停了
nvidia-smi --query-gpu=memory.used --format=csv   # 显存回落 = 真释放
```

`nohup` 起的进程脱离了终端，**停它和你在哪个窗口无关**，任意终端敲上面那条即可。

## 踩了什么坑

| 坑 | 现象 | 解法 |
|---|---|---|
| GitHub 连通不稳 | `curl` 20 秒超时（`http_code=000`），但 `git ls-remote` 却能通 | 先试直连，失败再换 `gitclone.com` 镜像 |
| 别把一次超时当结论 | 清华 / gitee / pypi 都稳定，只有 GitHub 抖 | `curl` 和 `git` 的结果可能不一致，换一种方式再测一次 |
| `src refspec main does not match any` | 本地分支叫 `master` | `git branch -m main` |
| 只读 `.git` | 沙盒挂载，能改文件不能提交 | 在终端手动提交 |
| `nvcc` 找不到 | CUDA 不在 PATH | 编译时显式传 `CMAKE_CUDA_COMPILER` |
| 端口只监听 `127.0.0.1` | 笔记本连不上 | SSH 端口转发，或 `--host 0.0.0.0`（谨慎） |
| 无 API key + CORS 全开 | 日志里的安全警告 | 本机自用无碍，**暴露公网前必须处理** |

## 还没搞懂什么

- **mmproj 与多模态**：模型目录里没有 mmproj 文件，所以现在看不了图。要视觉得补一份配套的 mmproj。
- **上下文怎么放宽**：原生支持 256K，现在只开了 16K。KV cache 的显存账要算清楚再往上加。
- **`reasoning_content` 怎么关**：Qwen 的思考模式默认开着，会吃额外 token、拖长延迟。需要时怎么干脆地关掉？
- **4 个并行槽**：服务默认 `n_slots=4`，KV cache 是四份。单用户场景要不要降到 1 省显存？
