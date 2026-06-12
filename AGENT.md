## Project

AutoAgenix is a privacy-first browser-based tools platform.

Mission:

Build the best collection of lightweight online utilities for creators, developers, founders, and professionals.

The platform should eventually contain 100+ tools.

Examples:

* Burn Rate Calculator
* Runway Calculator
* EXIF Metadata Remover
* JSON Formatter
* CSV Tools
* Screenshot Redactor
* YouTube Thumbnail Safe Zone Checker

All tools should be:

* Fast
* Browser-based
* Mobile-friendly
* SEO optimized
* Accessible

---

## Technology Stack

Frontend:

* Astro
* TypeScript
* Tailwind CSS

Deployment:

* Cloudflare Pages

Backend:

* None or Supabase if needed ask for approval if needed

Database:

* None or Supabase if needed ask for approval if needed

Authentication:

* None or Supabase if needed ask for approval if needed

Storage:

* None or Supabase if needed ask for approval if needed

Principle:

Everything should run locally in the browser whenever possible.

---

## Design Philosophy

Inspired by:

* Linear
* Vercel
* Stripe
* Raycast

Requirements:

* Minimal
* Premium
* Fast
* Clean typography
* High readability
* Mobile-first

Avoid:

* Excessive gradients
* Flashy animations
* Dashboard-like complexity
* Heavy JavaScript

---

## Development Principles

1. Simplicity First

Prefer simple solutions over clever solutions.

2. SEO First

Every tool page must be indexable.

Every tool page must include:

* Title
* Meta description
* FAQ section
* Related tools
* Internal links

3. Reusability

Create reusable components.

Avoid duplicated code.

4. Scalability

Assume the platform will eventually contain:

* 100+ tools
* 500+ blog articles

Architecture should support growth.

5. Performance

Target:

* Lighthouse > 95
* Minimal JavaScript
* Static generation whenever possible

6. Mobile responsive

Target:

* Use mobile first approch
* Should support all the sizes

7. Code Modularity

Target:

* Try to build modular code
* Find if this component exist already focus on resuing the components


---

## Folder Structure

src/

components/
layouts/
pages/
content/
lib/
data/
styles/
types/

Keep tool logic inside:

src/lib/

Keep tool metadata inside:

src/data/tools.ts

---

## Tool Registry

Every tool must be registered.

Example:

{
slug: "burn-rate-calculator",
title: "Burn Rate Calculator",
category: "startup",
description: "...",
keywords: [],
featured: true
}

Do not hardcode tool listings.

All listings should be generated from the registry.

---

## Tool Page Requirements

Every tool page must contain:

1. Tool Interface
2. Description
3. How It Works
4. FAQ
5. Related Tools
6. SEO Metadata

---

## Categories

Current categories:

* startup
* privacy
* creator
* developer
* ai

Future categories:

* pdf
* finance
* productivity
* social
* images

---

## Content Strategy

Every tool should eventually have:

1 tool page

AND

5 supporting article

Example:

Tool:
Burn Rate Calculator

Article:
How Startup Burn Rate Works

This creates topical authority.

---

## Coding Standards

Use:

* Strict TypeScript
* Functional components
* Strong typing
* No any types

Prefer:

* Small functions
* Reusable utilities
* Composition over duplication

---

## Accessibility

All pages must support:

* Keyboard navigation
* Proper labels
* Semantic HTML
* ARIA where necessary

---

## Deployment

Project must deploy successfully to:

* Cloudflare Pages

No server-side dependencies.

No Node-only runtime assumptions.

---

## Business Goal

Primary:

Build a long-term SEO asset generating recurring traffic.

Secondary:

Generate revenue through:

* Display ads
* Affiliate programs
* Premium tools (future)

Every decision should prioritize:

* Search visibility
* User experience
* Low operating cost
* Long-term maintainability
