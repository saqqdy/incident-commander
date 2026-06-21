---
layout: home
title: Incident Commander
titleTemplate: 面向 SRE 团队的 AI 驱动故障分析工具

hero:
  name: Incident Commander
  text: AI 驱动的故障分析工具
  tagline: 自动采集多源数据、推理因果链、生成结构化 Post-Mortem — 将 2 小时的复盘变成 10 分钟的评审
  image:
    src: /logo.svg
    alt: Incident Commander
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/saqqdy/incident-commander
    - theme: alt
      text: API 参考
      link: /zh/api/

features:
  - icon: 🔍
    title: 多源数据采集
    details: 并行采集 GitHub、Sentry、Grafana、Kibana 和部署平台的事件 — 一条命令全部搞定。
  - icon: 📊
    title: 自动时间线
    details: 将多源事件合并为统一、有序、去重的时间线，自动标注事件类型和关键转折点。
  - icon: 🧠
    title: AI 因果推理
    details: 语义感知的交叉验证，附带置信度标签和替代假设 — 透明胜于完美。
  - icon: 📝
    title: 结构化 Post-Mortem
    details: 自动生成完整的复盘报告 — 摘要、时间线、RCA、影响、修复措施和行动项。评审 10 分钟即可发出。
  - icon: 🛡️
    title: 优雅降级
    details: MCP Server 不可用？试试 CLI 工具。引导手动粘贴。全挂了？纯交互问答模式。
  - icon: 🔌
    title: 开放生态
    details: 自由组合 GitHub + Sentry + Grafana + Kibana — 无供应商锁定。支持自定义采集器扩展。
---
