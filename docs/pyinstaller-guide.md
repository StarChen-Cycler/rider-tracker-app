
# PyInstaller 打包指南

## 1. 简介
PyInstaller 是一个跨平台的打包工具，可将 Python 脚本及其依赖打包为**独立可执行文件**（Windows 下为 `.exe`，Linux/macOS 下为 ELF 或 Mach-O）。它支持“**整体打包**”和“**分目录打包**”两种模式，并可通过丰富的选项自定义行为。

---

## 2. 安装
```bash
pip install -U pyinstaller
```

---

## 3. 基础用法

| 目标               | 命令示例                               | 说明                              |
| ------------------ | -------------------------------------- | --------------------------------- |
| 打包为可执行文件   | `pyinstaller main.py`                | 默认生成 `dist/main/` 文件夹    |
| 单文件打包         | `pyinstaller --onefile main.py`      | 把所有依赖压缩进一个 `.exe`     |
| 无控制台窗口       | `pyinstaller --windowed main.py`     | 用于 GUI 程序（Tkinter、PyQt 等） |
| 指定图标           | `pyinstaller --icon=app.ico main.py` | `.ico` 文件即可                 |
| 自定义可执行文件名 | `pyinstaller --name MyApp main.py`   | 生成的 exe 为 `MyApp.exe`       |

---

## 4. 两种打包模式对比

| 模式                         | 命令示例                          | 输出目录          | 优点                         | 缺点                       |
| ---------------------------- | --------------------------------- | ----------------- | ---------------------------- | -------------------------- |
| **分目录（默认）**     | `pyinstaller main.py`           | `dist/main/`    | 启动快、体积小（依赖同目录） | 文件夹多，复制时需整目录   |
| **单文件（整体打包）** | `pyinstaller --onefile main.py` | `dist/main.exe` | 只有一个文件，便于分发       | 启动稍慢（解压到临时目录） |

> 若需“**仅打包运行所需的最小集合**”，使用 `--exclude-module` 或 `--collect-*` 系列选项（见第 6 节）。

---

## 5. 常用命令模板

### 5.1 控制台程序（CLI）

```bash
pyinstaller --onefile --name cli_tool main.py
```

### 5.2 图形界面程序（GUI）

```bash
pyinstaller --onefile --windowed --icon=app.ico --name MyGUI main.py
```

### 5.3 调试模式（保留源码）

```bash
pyinstaller --onedir --debug=all main.py
```

---

## 6. 精简/排除模块

| 选项                     | 示例                               | 作用                     |
| ------------------------ | ---------------------------------- | ------------------------ |
| `--exclude-module`     | `--exclude-module matplotlib`    | 排除不用的库，减小体积   |
| `--collect-binaries`   | `--collect-binaries mypackage`   | 只收集特定包的二进制文件 |
| `--collect-data`       | `--collect-data mypackage`       | 只收集数据文件           |
| `--collect-submodules` | `--collect-submodules mypackage` | 收集子模块               |

---

## 7. 隐藏导入（Hidden Import）

某些库（如 `scapy`, `pydantic`）在运行时动态导入，需手动声明：

```bash
pyinstaller --hidden-import=scapy.all --onefile main.py
```

---

## 8. 数据文件与额外资源

若脚本需要读取 **非 Python 文件**（如 `.json`, `.yaml`, 模型权重），使用 `--add-data`：

```bash
# Windows 用分号 ;  Linux/macOS 用冒号 :
pyinstaller --add-data "data/config.yaml;data" --onefile main.py
```

---

## 9. UPX 压缩

安装 UPX 后可进一步减小单文件体积：

```bash
pyinstaller --onefile --upx-dir /path/to/upx main.py
```

---

## 10. 打包后目录结构

```
project/
├── build/            # 临时构建文件
├── dist/
│   ├── main/         # 分目录模式输出
│   └── main.exe      # 单文件模式输出
└── main.spec         # 构建配置（可手动修改后 `pyinstaller main.spec`）
```

---

## 11. 常见错误与解决

| 错误提示                                     | 原因与解决                                              |
| -------------------------------------------- | ------------------------------------------------------- |
| `ModuleNotFoundError: No module named xxx` | 添加 `--hidden-import xxx` 或 `--paths path/to/xxx` |
| exe 打开后立即关闭                           | 去掉 `--windowed` 看控制台错误，或加 `--debug=all`  |
| 图标未生效                                   | 图标必须是 `.ico` 格式，大小 ≤ 256×256              |

---

## 12. 一键脚本示例（Windows）

```bat
@echo off
pyinstaller --clean ^
            --onefile ^
            --name MyApp ^
            --icon=app.ico ^
            --add-data "assets;assets" ^
            --hidden-import pkg_resources.py2_warn ^
            main.py
pause
```

---

## 13. 小结

- **简单需求**：`pyinstaller --onefile main.py` 即可。
- **GUI 程序**：加 `--windowed`。
- **精简体积**：用 `--exclude-module` 和 `--add-data`。
- **持续集成**：保留 `.spec` 文件，后续直接 `pyinstaller main.spec`。

更多参数见官方文档：https://pyinstaller.org/en/stable/usage.html

```

