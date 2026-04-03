# Cost Analysis - Course Companion FTE

## Phase 1: Zero-Backend-LLM (Free Tier)

### Infrastructure Costs (10,000 users/month)

| Component | Service | Cost Model | Monthly Cost |
|-----------|---------|------------|-------------|
| Storage | Cloudflare R2 | $0.015/GB + $0.36/M reads | ~$5 |
| Database | Neon/Supabase | Free tier | $0 |
| Compute | Fly.io/Railway | ~$5-20/mo | ~$10 |
| Domain + SSL | Namecheap | ~$12/year | ~$1 |
| **TOTAL** | | | **$16/month** |
| **Cost per User** | | | **$0.0016** |

### LLM Costs
| Component | Cost |
|-----------|------|
| Backend LLM calls | **$0** (Zero-Backend-LLM) |
| ChatGPT usage | $0 (users use their own subscription) |
| **Total LLM Cost** | **$0** |

### Cost at Scale

| Users | Monthly Infra | Per User |
|-------|--------------|----------|
| 1,000 | $16 | $0.016 |
| 10,000 | $16 | $0.0016 |
| 50,000 | $41 | $0.0008 |
| 100,000 | $66 | $0.0007 |

**Key Insight:** Near-zero marginal cost per additional user.

---

## Phase 2: Hybrid Intelligence (Premium Features)

### LLM Cost Per Request

| Feature | Model | Tokens/Request | Cost/Request |
|---------|-------|---------------|-------------|
| Adaptive Learning Path | Claude Sonnet | ~2,000 | $0.018 |
| LLM Assessment | Claude Sonnet | ~1,500 | $0.014 |

### Premium User Cost (1,000 premium users)

| Feature | Usage/User/Mo | Cost/User/Mo | Total/Mo |
|---------|--------------|-------------|----------|
| Adaptive Path | 4 requests | $0.072 | $72 |
| LLM Assessment | 2 requests | $0.028 | $28 |
| **Total LLM** | | **$0.10/user** | **$100** |
| Infrastructure | | | $25 |
| **Grand Total** | | | **$125** |
| **Per Premium User** | | | **$0.125** |

### Revenue vs Cost (Premium)

| Metric | Value |
|--------|-------|
| Premium Price | $9.99/month |
| LLM Cost per User | $0.10/month |
| Infrastructure per User | $0.025/month |
| **Margin** | **$9.87 (98.7%)** |

---

## Phase 3: Consolidated Web App

### Infrastructure (50,000 users, 10% premium)

| Component | Cost |
|-----------|------|
| Free users (45,000) infra | $41 |
| Premium users (5,000) infra | $25 |
| Premium users LLM | $500 |
| **TOTAL** | **$566/month** |
| **Blended cost/user** | **$0.011** |

### Revenue Projection

| Tier | Users | Price | Monthly Revenue |
|------|-------|-------|----------------|
| Free | 45,000 | $0 | $0 |
| Premium | 4,000 | $9.99 | $39,960 |
| Pro | 800 | $19.99 | $15,992 |
| Team | 200 | $49.99 | $9,998 |
| **Total** | **50,000** | | **$65,950** |

### Profitability

| Metric | Value |
|--------|-------|
| Monthly Revenue | $65,950 |
| Monthly Cost | $566 |
| **Monthly Profit** | **$65,384** |
| **Margin** | **99.1%** |

---

## Comparison: Human Tutor vs Digital FTE

| Metric | Human Tutor | Digital FTE | Savings |
|--------|------------|-------------|---------|
| Monthly Cost | $3,000 | $200-500 | 85-93% |
| Hours/Week | 40 | 168 | 4.2x |
| Students | 20-50 | Unlimited | Infinite |
| Cost/Session | $50 | $0.25 | 99% |
| Sessions/Month | 160 | 50,000+ | 312x |

---

## Cost Optimization Strategies

1. **Zero-Backend-LLM as default** - eliminates all LLM inference costs
2. **Premium gating** - LLM costs only for paying users
3. **Content caching** - R2 edge caching reduces read costs
4. **Database optimization** - connection pooling, query optimization
5. **Async processing** - background jobs for non-critical operations

---

*Analysis based on January 2026 pricing*
