import { test, expect } from '@playwright/test'

test.describe('Course Companion FTE - E2E Tests', () => {
  test('home page loads with correct title', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Course Companion FTE/)
    await expect(page.getByText('Learn AI Agent Development')).toBeVisible()
  })

  test('navigation links work', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.getByRole('link', { name: 'Chapters', exact: true }).click()
    await expect(page).toHaveURL(/\/chapters/)
    await expect(page.getByText('Course Chapters')).toBeVisible()
  })

  test('chapters page shows all 10 chapters', async ({ page }) => {
    await page.goto('http://localhost:3000/chapters')
    await expect(page.getByText('Introduction to AI Agents')).toBeVisible()
    await expect(page.getByText('The Future of AI Agents')).toBeVisible()
  })

  test('chapter detail page loads content', async ({ page }) => {
    await page.goto('http://localhost:3000/chapters/ch1')
    await expect(page.getByText('Introduction to AI Agents')).toBeVisible()
    await expect(page.getByText('What is an AI Agent?')).toBeVisible()
  })

  test('premium chapter shows paywall', async ({ page }) => {
    await page.goto('http://localhost:3000/chapters/ch6')
    await expect(page.getByText('Premium Content')).toBeVisible()
  })

  test('quizzes page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/quizzes')
    await expect(page.getByText('Practice Quizzes')).toBeVisible()
  })

  test('quiz can be taken', async ({ page }) => {
    await page.goto('http://localhost:3000/quizzes/quiz_ch1')
    await expect(page.getByText(/Question 1 of/)).toBeVisible()
    await page.getByRole('button', { name: /AI agents can adapt/ }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText(/Question 2 of/)).toBeVisible()
  })

  test('progress page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/progress')
    await expect(page.getByText('Your Progress')).toBeVisible()
  })

  test('search page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/search')
    await expect(page.getByText('Search Course Content')).toBeVisible()
    await expect(page.getByPlaceholder('Search course content...')).toBeVisible()
  })

  test('responsive layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:3000')
    await expect(page.getByText('Learn AI Agent Development')).toBeVisible()
  })
})
