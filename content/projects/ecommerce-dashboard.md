---
title: "Ecommerce Analytics Dashboard"
description: "Real-time sales and inventory analytics for a high-volume Shopify store, processing 10k+ daily events."
tags: ["Vue 3", "D3.js", "Node.js", "PostgreSQL", "WebSockets"]
year: 2023
featured: false
liveUrl: "https://analytics.example.com"
order: 2
coverColor: "accent"
---

## The Problem

The store's existing analytics were limited to basic Shopify reports. Leadership needed real-time visibility into inventory levels, conversion funnels, and customer lifetime value, but the data was siloed across multiple platforms and updated only hourly.

## What I Built

I built a custom dashboard using Vue 3 and D3.js for visualizations, with a Node.js backend streaming data via WebSockets. The system aggregates Shopify, Google Analytics, and warehouse inventory into a unified PostgreSQL data warehouse. The frontend updates key metrics in real time without polling, and includes a custom alerting system for low stock and conversion drops.

## What I Learned

Real-time data at scale requires careful state management and debouncing to avoid UI thrashing. I learned to design for eventual consistency — not every metric needs sub-second precision. The biggest challenge was mapping disparate data models into a coherent schema; I ended up building a normalization layer that became reusable for future integrations. Performance profiling taught me to batch DOM updates and use requestAnimationFrame for smooth chart rendering.