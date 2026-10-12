import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { followHeaderLink } from './header';

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

    await followHeaderLink(page, 'Patterns');
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

    await followHeaderLink(page, 'Obstacles');
    await expect(page).toHaveURL('/obstacles/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Obstacles');

    await followHeaderLink(page, 'Anti-Patterns');
    await expect(page).toHaveURL('/anti-patterns/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Anti-Patterns');

    await followHeaderLink(page, 'Patterns');
    await expect(page).toHaveURL('/patterns/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Patterns');

    await followHeaderLink(page, 'Home');
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

    await followHeaderLink(page, 'Contributors');
    await expect(page).toHaveURL('/contributors/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Contributors');

    const contributorCard = page.getByRole('article').first();
    await expect(contributorCard).toBeVisible();
    const contributorName = contributorCard.getByRole('link').filter({ hasNotText: /contributions?$/ });
    await expect(contributorName).toBeVisible();
    await expect(contributorName).toHaveAttribute('target', '_blank');
    await expect(contributorCard.getByRole('img', { name: /avatar/ })).toBeVisible();
    const contributionsBadge = contributorCard.getByRole('link', { name: /contributions?$/ });
    await expect(contributionsBadge).toBeVisible();
    await expect(contributionsBadge).toHaveAttribute('href', /^\/contributors\/.+\/$/);
  });
});

const searchBox = (page: Page) => page.getByRole('combobox', { name: 'Search patterns' });
const searchResults = (page: Page) => page.getByRole('listbox', { name: 'Search results' });

test.describe('Search Functionality', () => {
  test('search bar is visible with correct placeholder', async ({ page }) => {
    await page.goto('/');

    await expect(searchBox(page)).toBeVisible();
    await expect(searchBox(page)).toHaveAttribute('placeholder', 'Search patterns...');
  });

  test('can type in search input and dropdown appears with results', async ({ page }) => {
    await page.goto('/');

    await searchBox(page).fill('active');

    await expect(searchResults(page)).toBeVisible();
    await expect(searchResults(page).getByRole('option').first()).toBeVisible();
  });

  test('clicking a search result navigates to correct pattern page', async ({ page }) => {
    await page.goto('/');

    await searchBox(page).fill('active partner');

    const activePartner = searchResults(page).getByRole('option', { name: 'Active Partner' });
    await expect(activePartner).toBeVisible();
    await activePartner.click();

    await expect(page).toHaveURL('/patterns/active-partner/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Active Partner');
  });

  test('search returns relevant results and is case-insensitive', async ({ page }) => {
    await page.goto('/');

    await searchBox(page).fill('ACTIVE');

    await expect(searchResults(page).getByRole('option', { name: 'Active Partner' })).toBeVisible();
  });

  test('no results found message appears for nonsense query', async ({ page }) => {
    await page.goto('/');

    await searchBox(page).fill('xyzabc123nonexistent');

    await expect(page.getByRole('status')).toHaveText('No results found');
  });

  test('dropdown closes when clicking outside', async ({ page }) => {
    await page.goto('/');

    await searchBox(page).fill('active');
    await expect(searchResults(page)).toBeVisible();

    await page.getByRole('heading', { level: 1 }).click();
    await expect(searchResults(page)).not.toBeVisible();
  });

  test('can navigate search results with arrow keys', async ({ page }) => {
    await page.goto('/');

    await searchBox(page).fill('active');
    await expect(searchResults(page)).toBeVisible();

    await searchBox(page).press('ArrowDown');
    await expect(searchResults(page).getByRole('option', { selected: true })).toBeVisible();

    await searchBox(page).press('ArrowDown');
    await expect(searchResults(page).getByRole('option', { selected: true })).toHaveCount(1);
  });

  test('enter key navigates to selected result', async ({ page }) => {
    await page.goto('/');

    await searchBox(page).fill('active partner');
    await expect(searchResults(page)).toBeVisible();

    await searchBox(page).press('ArrowDown');
    await expect(searchResults(page).getByRole('option', { selected: true })).toBeVisible();

    await searchBox(page).press('Enter');
    await expect(page).toHaveURL(/\/patterns\/.*\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('escape key closes dropdown and clears search', async ({ page }) => {
    await page.goto('/');

    await searchBox(page).fill('active');
    await expect(searchResults(page)).toBeVisible();

    await searchBox(page).press('Escape');
    await expect(searchResults(page)).not.toBeVisible();
    await expect(searchBox(page)).toHaveValue('');
  });

  test('search displays results grouped by category', async ({ page }) => {
    await page.goto('/');

    await searchBox(page).fill('bias');

    await expect(searchResults(page).getByRole('group').first()).toBeVisible();
    await expect(searchResults(page).getByRole('group', { name: /Obstacles|Anti-Patterns|Patterns/ }).first()).toBeVisible();
  });
});
