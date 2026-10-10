import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

const headerLink = (page: Page, name: string) =>
  page.getByRole('navigation').getByRole('link', { name, exact: true });

const firstPatternOnList = (page: Page) =>
  page.getByRole('main').getByRole('link').filter({ has: page.getByRole('heading') }).first();

test.describe('Smoke Tests - Critical User Journeys', () => {
  test('home page loads with correct title and main heading', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Augmented Coding Patterns/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Augmented Coding Patterns');
  });

  test('navigate from home to patterns list page', async ({ page }) => {
    await page.goto('/');

    await headerLink(page, 'Patterns').click();
    await expect(page).toHaveURL('/patterns/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Patterns');
  });

  test('navigate from patterns list to pattern detail page and verify content displays', async ({ page }) => {
    await page.goto('/patterns/');

    await firstPatternOnList(page).click();

    await expect(page).toHaveURL(/\/patterns\/[a-z-]+\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('article')).toBeVisible();
  });

  test('use back button to return to patterns list', async ({ page }) => {
    await page.goto('/patterns/');

    await firstPatternOnList(page).click();
    await expect(page).toHaveURL(/\/patterns\/[a-z-]+\//);

    await page.goBack();
    await expect(page).toHaveURL('/patterns/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Patterns');
  });

  test('header navigation works across pages', async ({ page }) => {
    await page.goto('/');

    await headerLink(page, 'Obstacles').click();
    await expect(page).toHaveURL('/obstacles/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Obstacles');

    await headerLink(page, 'Anti-Patterns').click();
    await expect(page).toHaveURL('/anti-patterns/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Anti-Patterns');

    await headerLink(page, 'Patterns').click();
    await expect(page).toHaveURL('/patterns/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Patterns');

    await headerLink(page, 'Home').click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Augmented Coding Patterns');
  });

  test('can navigate via related links', async ({ page }) => {
    await page.goto('/patterns/active-partner/');

    const related = page.getByRole('complementary');
    await expect(related.getByRole('heading', { name: /Related/ })).toBeVisible();
    await expect(related.getByRole('heading', { name: /Obstacles/ })).toBeVisible();

    const complianceBiasLink = related.getByRole('link', { name: /Compliance Bias/ });
    await expect(complianceBiasLink).toBeVisible();
    await complianceBiasLink.click();

    await expect(page).toHaveURL('/obstacles/compliance-bias/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Compliance Bias');
    await expect(page.getByRole('article')).toBeVisible();
  });

  test('navigate to contributors page and verify contributor cards display', async ({ page }) => {
    await page.goto('/');

    await headerLink(page, 'Contributors').click();
    await expect(page).toHaveURL('/contributors/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Contributors');

    const contributorCard = page.getByRole('article').first();
    await expect(contributorCard).toBeVisible();
    await expect(contributorCard.getByRole('link').filter({ hasNotText: /contributions?$/ })).toBeVisible();
    await expect(contributorCard.getByRole('img', { name: /avatar/ })).toBeVisible();
    await expect(contributorCard.getByRole('link', { name: /contributions?$/ })).toBeVisible();
  });
});

test.describe('Search Functionality', () => {
  test('search bar is visible with correct placeholder', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', 'Search patterns...');
    await expect(searchInput).toHaveAttribute('aria-label', 'Search patterns');
  });

  test('can type in search input and dropdown appears with results', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('active');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    const results = dropdown.locator('a[href*="/patterns/"]');
    await expect(results.first()).toBeVisible();
  });

  test('clicking a search result navigates to correct pattern page', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('active partner');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    const activePartnerLink = dropdown.locator('a[href="/patterns/active-partner/"]');
    await expect(activePartnerLink).toBeVisible();
    await activePartnerLink.click();

    await expect(page).toHaveURL('/patterns/active-partner/');
    await expect(page.locator('h1')).toContainText('Active Partner');
  });

  test('search returns relevant results and is case-insensitive', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('ACTIVE');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    const activePartnerLink = dropdown.locator('a[href="/patterns/active-partner/"]');
    await expect(activePartnerLink).toBeVisible();
  });

  test('no results found message appears for nonsense query', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('xyzabc123nonexistent');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    const noResults = dropdown.locator('text=No results found');
    await expect(noResults).toBeVisible();
  });

  test('dropdown closes when clicking outside', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('active');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    await page.locator('h1').click();
    await expect(dropdown).not.toBeVisible();
  });

  test('can navigate search results with arrow keys', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('active');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    await searchInput.press('ArrowDown');
    const selectedResult = dropdown.locator('[class*="resultItemSelected"]');
    await expect(selectedResult).toBeVisible();

    await searchInput.press('ArrowDown');
    const selectedResults = dropdown.locator('[class*="resultItemSelected"]');
    await expect(selectedResults).toHaveCount(1);
  });

  test('enter key navigates to selected result', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('active partner');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    await searchInput.press('ArrowDown');
    const selectedResult = dropdown.locator('[class*="resultItemSelected"]');
    await expect(selectedResult).toBeVisible();

    await searchInput.press('Enter');
    await expect(page).toHaveURL(/\/patterns\/.*\//);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('escape key closes dropdown and clears search', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('active');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    await searchInput.press('Escape');
    await expect(dropdown).not.toBeVisible();
    await expect(searchInput).toHaveValue('');
  });

  test('search displays results grouped by category', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('bias');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    const categoryGroups = dropdown.locator('[class*="categoryGroup"]');
    await expect(categoryGroups.first()).toBeVisible();

    const categoryLabel = dropdown.locator('[class*="categoryLabel"]');
    await expect(categoryLabel.first()).toBeVisible();
  });
});
