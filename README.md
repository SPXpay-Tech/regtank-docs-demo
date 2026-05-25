# Regtank Exchange API · documentation experiments

Five different ways to render the same OpenAPI 3.1 spec — Scalar, Redoc, Swagger UI, Stoplight Elements, and a hand-built Stripe-style SPA.

**Live demos:** open the deployed [GitHub Pages site](https://spxpay-tech.github.io/regtank-docs-demo/).

| Variant | Tech | URL |
|---|---|---|
| A | Scalar — `@scalar/api-reference` | `/variants/scalar/` |
| B | Redoc — `redoc.standalone.js` | `/variants/redoc/` |
| C | Swagger UI — `swagger-ui-dist` | `/variants/swagger-ui/` |
| D | Stoplight Elements — `@stoplight/elements` | `/variants/stoplight/` |
| E | Hand-built SPA — vanilla HTML/CSS/JS | `/variants/custom-spa/` |

Canonical spec: [`spec/regtank-exchange.yaml`](spec/regtank-exchange.yaml).

Built end-to-end in one Lark thread on 2026-05-26 — see the
[delivery doc](#) for the side-by-side comparison and recommendation.
