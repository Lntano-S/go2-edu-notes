# 目录与脚本

> 这一页专治"过一晚就忘了 `~/scripts` 里到底是什么"。

## 家目录：一眼看全

```
/home/shutianyu/
├── projects/                  代码仓
│   └── llama.cpp/             源码 + build/
├── logs/                      运行日志
│   ├── llama-server.log
│   └── build.log
└── scripts/                   可复用小脚本（已加进 PATH）
    └── llama                  llama-server 起停
```

## 每样东西放哪、为什么

| 位置 | 放什么 | 不放什么 |
|---|---|---|
| `~/projects/` | 代码仓，一个项目一个目录 | 临时文件 |
| `~/logs/` | 服务的运行日志 | 源码、数据 |
| `~/scripts/` | 可复用的运维脚本 | 项目代码 |
| `/srv/models/` | 模型文件（**只读引用，不动它**） | —— |

原则是**源码、产物、数据、日志四类分开**。好处很朴素：出问题只翻一个地方，重装环境也只坏自己这一亩地。

模型为什么不在家目录：`/srv` 是 Linux 给"服务数据"留的标准位置，比塞进 home 规范。它归 root 所有，平时只读；要往里加新模型才需要 `sudo`。

## 现有的东西

### `~/projects/llama.cpp/`
llama.cpp 源码 + 编译产物。快照 commit `81bc6b8`（tag b11200）。

编好的可执行文件都在 `build/bin/` 里：

- **`llama-server`** ← 我们要的那个
- `llama-cli`、`llama-bench`、`llama-quantize` 等一堆

**编译产物不用重编。** 重启服务只是重新跑一条命令而已。

### `~/logs/`
- **`llama-server.log`**：服务的全部输出——启动信息、报错、崩溃现场。出问题第一个看它。
- `build.log`：编译时的输出。

### `~/scripts/llama`
llama-server 的起停脚本，五个子命令：

```bash
llama start     # 起服务
llama stop      # 停服务
llama restart   # 重启
llama status    # 看活着没
llama log       # 盯日志
```

**为什么能直接敲**：`~/scripts` 已加进 `PATH`，不用写全路径。

#### 让脚本变成命令（PATH）

```bash
echo 'export PATH="$PATH:$HOME/scripts"' >> ~/.bashrc
source ~/.bashrc
```

加进 PATH 时**放末尾，别放最前**。PATH 从左往右找，谁在前谁优先：放前面会盖掉同名的系统命令，放末尾则只有系统里找不到时才轮到它。注意 `~/.bashrc` 的改动只对**新开的 shell** 生效，`source` 一下当前这个才立刻生效。

> PATH 就是一串目录，按顺序去里面找命令。之前 `nvcc` 找不到，就是因为 `/usr/local/cuda/bin` 不在这串里。

验证：

```bash
which llama      # → /home/shutianyu/scripts/llama
```

## 运维速查

有脚本的话，直接用 [llama](#scriptsllama) 那五个子命令最省事。裸命令在下面，知道底层发生了什么：

```bash
pkill llama-server                                     # 停
pgrep -af llama-server                                 # 看活没
curl -s http://127.0.0.1:8080/v1/models | head -c 80   # 端点通不通
tail -f ~/logs/llama-server.log                        # 盯日志
```

起服务的完整命令见 [llama.cpp 部署与验证](/server/llama-cpp)。

## 本机工作区里的相关文件

这些**不在服务器上**，在本机的 `Lab_mission/unitree_go2_dev/server/`：

| 文件 | 干什么 | 现状 |
|---|---|---|
| `setup_llama_cpp.sh` | 服务器端一键脚本（check / deps / build / serve / verify…） | 当前走手敲路线，它留作备选 |
| `srv.sh` | 本机免密 SSH 包装 | 改用 Termius 后基本用不上 |
| `README.md` | 阶段①的说明与已知的坑 | —— |
