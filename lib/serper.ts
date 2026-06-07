export async function searchCompany(companyName: string): Promise<string> {
  const queries = [
    `${companyName} hiring new jobs 2026`,
    `${companyName} news announcement expansion`,
    `${companyName} funded growth leadership`,
  ]

  const results: string[] = []

  for (const query of queries) {
    try {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': process.env.SERPER_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query, num: 5 }),
      })

      const data = await response.json()

      if (data.organic) {
        const snippets = data.organic
          .slice(0, 4)
          .map((r: { title: string; snippet: string; link: string }) =>
            `TITLE: ${r.title}\nSNIPPET: ${r.snippet}\nURL: ${r.link}`
          )
          .join('\n\n')
        results.push(`--- Query: ${query} ---\n${snippets}`)
      }

      if (data.news) {
        const news = data.news
          .slice(0, 3)
          .map((r: { title: string; snippet: string }) =>
            `NEWS: ${r.title} - ${r.snippet}`
          )
          .join('\n')
        results.push(news)
      }
    } catch (err) {
      console.error(`Search failed for query: ${query}`, err)
    }
  }

  return results.join('\n\n')
}

export function getDemoIntel(companyName: string): string {
  return `--- Demo Intel for ${companyName} ---
TITLE: ${companyName} Expands Digital Marketing Team - Hiring 5 New Roles
SNIPPET: ${companyName} is aggressively expanding its digital presence, posting roles for Head of Growth, 2x Performance Marketing Managers, and a Content Strategist. The company aims to double online revenue by Q4 2026.

NEWS: ${companyName} secures Series A funding of $3.2M to accelerate e-commerce expansion
SNIPPET: Following strong 2025 performance, ${companyName} has closed its Series A round and plans to invest heavily in digital infrastructure and customer acquisition.

TITLE: ${companyName} appoints new Chief Revenue Officer from Careem
SNIPPET: Industry veteran Sana Malik joins ${companyName} as CRO, bringing 8 years of growth experience. She has immediately signaled plans to revamp the sales funnel and invest in automation.

NEWS: ${companyName} launches new product line targeting SME segment
SNIPPET: The company's pivot toward SME customers requires new go-to-market collateral, website updates, and a refreshed brand identity for the new segment.`
}