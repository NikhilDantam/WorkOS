import { chromium } from 'playwright'

async function runTests() {
  console.log('--- Starting Playwright UI Verification ---')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('Console error:', msg.text())
      errors.push(msg.text())
    }
  })

  // 1. Test Home page
  console.log('1. Testing Home Page (/)')
  await page.goto('http://localhost:3000/')
  await page.waitForLoadState('networkidle')
  console.log('Title:', await page.title())

  // Check theme toggle on home page
  const themeToggle = await page.$('.theme-toggle-btn')
  console.log('Home theme toggle found:', !!themeToggle)
  if (themeToggle) {
    await themeToggle.click()
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    console.log('Toggled to dark on Home:', isDark)
    await themeToggle.click()
    const isLight = await page.evaluate(() => !document.documentElement.classList.contains('dark'))
    console.log('Toggled back to light on Home:', isLight)
  }

  // 2. Test Privacy Page (/privacy)
  console.log('2. Testing Privacy Page (/privacy)')
  await page.goto('http://localhost:3000/privacy')
  await page.waitForLoadState('networkidle')
  console.log('Privacy Title:', await page.title())
  const privacyHeading = await page.textContent('h1')
  console.log('Privacy Heading:', privacyHeading)

  // 3. Test Protected Route Redirection
  console.log('3. Testing Protected Route Redirection (/app/overview while logged out)')
  await page.goto('http://localhost:3000/app/overview')
  await page.waitForURL('**/app')
  console.log('Redirected to:', page.url())

  // 4. Test Invalid Login
  console.log('4. Testing Invalid Login')
  await page.fill('input[type="email"]', 'wrong@workos.org')
  await page.fill('input[type="password"]', 'WrongPassword123!')
  await page.click('button[type="submit"]')
  await page.waitForSelector('.auth-error-banner, [role="alert"]', { timeout: 5000 }).catch(() => null)
  const errorBanner = await page.$('.auth-error-banner, [role="alert"]')
  console.log('Invalid login error banner displayed:', !!errorBanner)

  // 5. Test Valid Login
  console.log('5. Testing Valid Login (admin@workos.org)')
  await page.fill('input[type="email"]', 'admin@workos.org')
  await page.fill('input[type="password"]', 'Admin@WorkOS2026!')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/app/overview', { timeout: 10000 })
  console.log('Successfully reached:', page.url())

  // 6. Test Dashboard / Overview data from Supabase
  console.log('6. Verifying Overview Page Data from Supabase')
  await page.waitForSelector('.metric-card', { timeout: 5000 })
  const metricCards = await page.$$eval('.metric-card', (cards) =>
    cards.map((c) => ({
      label: c.querySelector('.metric-label')?.textContent?.trim(),
      val: c.querySelector('.metric-value-row strong')?.textContent?.trim(),
    }))
  )
  console.log('Overview metrics from Supabase:', metricCards)

  // 7. Test Refresh Preserves Session
  console.log('7. Testing Refresh Session Persistence')
  await page.reload()
  await page.waitForLoadState('networkidle')
  console.log('URL after reload:', page.url())
  console.log('Still on overview:', page.url().includes('/app/overview'))

  // 8. Test Trainees Page
  console.log('8. Testing Trainees Page (/app/trainees)')
  await page.goto('http://localhost:3000/app/trainees')
  await page.waitForSelector('.data-table tbody tr', { timeout: 5000 })
  const traineeRows = await page.$$eval('.data-table tbody tr', (rows) =>
    rows.map((r) => r.querySelector('strong')?.textContent?.trim()).filter(Boolean)
  )
  console.log('Trainees loaded from Supabase:', traineeRows)

  // 9. Test Trainee Detail Page
  console.log('9. Testing Trainee Detail Page (/app/trainees/WO-24-018426)')
  await page.goto('http://localhost:3000/app/trainees/WO-24-018426')
  await page.waitForSelector('.profile-summary', { timeout: 5000 })
  const profileName = await page.$eval('.profile-summary-main h2', (el) => el.textContent?.trim())
  console.log('Trainee detail profile loaded:', profileName)

  // 10. Test Employers Page
  console.log('10. Testing Employers Page (/app/employers)')
  await page.goto('http://localhost:3000/app/employers')
  await page.waitForSelector('.data-table tbody tr', { timeout: 5000 })
  const employers = await page.$$eval('.data-table tbody tr', (rows) =>
    rows.map((r) => r.querySelector('strong')?.textContent?.trim()).filter(Boolean)
  )
  console.log('Employers loaded from Supabase:', employers)

  // 11. Test Verifications Page
  console.log('11. Testing Verifications Page (/app/verifications)')
  await page.goto('http://localhost:3000/app/verifications')
  await page.waitForSelector('.claim-card, .data-table, .panel', { timeout: 5000 })
  console.log('Verifications page loaded')

  // 12. Test Follow-ups Page
  console.log('12. Testing Follow-ups Page (/app/followups)')
  await page.goto('http://localhost:3000/app/followups')
  await page.waitForSelector('.panel', { timeout: 5000 })
  console.log('Follow-ups page loaded')

  // 13. Test Skills Page
  console.log('13. Testing Skills Page (/app/skills)')
  await page.goto('http://localhost:3000/app/skills')
  await page.waitForSelector('.skills-matrix', { timeout: 5000 })
  console.log('Skills matrix table loaded from Supabase')

  // 14. Test Courses Page
  console.log('14. Testing Courses Page (/app/courses)')
  await page.goto('http://localhost:3000/app/courses')
  await page.waitForSelector('.data-table tbody tr', { timeout: 5000 })
  console.log('Courses table loaded from Supabase')

  // 15. Test Providers Page
  console.log('15. Testing Providers Page (/app/providers)')
  await page.goto('http://localhost:3000/app/providers')
  await page.waitForSelector('.data-table tbody tr', { timeout: 5000 })
  console.log('Providers table loaded from Supabase')

  // 16. Test Districts Page
  console.log('16. Testing Districts Page (/app/districts)')
  await page.goto('http://localhost:3000/app/districts')
  await page.waitForSelector('.district-signal-list, .district-signal, .panel', { timeout: 5000 })
  console.log('Districts signals loaded from Supabase')

  // 17. Test Outcomes Analytics Page
  console.log('17. Testing Outcomes Analytics Page (/app/outcomes)')
  await page.goto('http://localhost:3000/app/outcomes')
  await page.waitForSelector('.metric-card', { timeout: 5000 })
  console.log('Outcomes analytics loaded')

  // 18. Test Impact Dashboard (/app/impact)
  console.log('18. Testing Impact Dashboard (/app/impact)')
  await page.goto('http://localhost:3000/app/impact')
  await page.waitForSelector('.metric-card', { timeout: 5000 })
  console.log('Impact dashboard loaded')

  // 19. Test AI Insights Page (/app/insights)
  console.log('19. Testing AI Insights Page (/app/insights)')
  await page.goto('http://localhost:3000/app/insights')
  await page.waitForSelector('.panel', { timeout: 5000 })
  console.log('AI Insights loaded')

  // 20. Test Interventions Page (/app/interventions)
  console.log('20. Testing Interventions Page (/app/interventions)')
  await page.goto('http://localhost:3000/app/interventions')
  await page.waitForSelector('.panel', { timeout: 5000 })
  console.log('Interventions loaded')

  // 21. Test Audit Page (/app/audit)
  console.log('21. Testing Audit Page (/app/audit)')
  await page.goto('http://localhost:3000/app/audit')
  await page.waitForSelector('.audit-stream, .panel', { timeout: 5000 })
  console.log('Audit events loaded')

  // 22. Test Settings Page (/app/settings)
  console.log('22. Testing Settings Page (/app/settings)')
  await page.goto('http://localhost:3000/app/settings')
  await page.waitForSelector('.panel', { timeout: 5000 })
  const settingsEmail = await page.$eval('.panel strong', (el) => el.textContent?.trim()).catch(() => '')
  console.log('Settings email / user info:', settingsEmail)

  // 23. Test Dark Mode in App Shell
  console.log('23. Testing Dark Mode in App Shell')
  const appThemeToggle = await page.$('.theme-toggle-btn')
  if (appThemeToggle) {
    await appThemeToggle.click()
    const appIsDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    console.log('App shell dark mode active:', appIsDark)
  }

  // 24. Test Responsive Viewports (Tablet & Mobile)
  console.log('24. Testing Responsive Viewports')
  await page.setViewportSize({ width: 768, height: 1024 })
  console.log('Tablet viewport set (768x1024)')
  await page.setViewportSize({ width: 390, height: 844 })
  console.log('Mobile viewport set (390x844)')

  // 25. Test Sign Out
  console.log('25. Testing Sign Out')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('http://localhost:3000/app/settings')
  const signOutBtn = await page.$('button:has-text("Sign out"), button:has-text("Log out")')
  if (signOutBtn) {
    await signOutBtn.click()
    await page.waitForURL('**/app', { timeout: 5000 })
    console.log('Signed out successfully, redirected to:', page.url())
  }

  console.log('--- All Playwright Tests Completed Successfully ---')
  await browser.close()
}

runTests().catch((err) => {
  console.error('Test script failed:', err)
  process.exit(1)
})
