document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/public/pages');

        if (!response.ok) {
            throw new Error('Pages could not be loaded');
        }

        const pages = await response.json();

        const homePage = Array.isArray(pages)
            ? pages.find(page => page.slug === 'home')
            : pages;

        if (!homePage) {
            console.log('Home page content not found');
            return;
        }

        const heading = document.getElementById('homeHeroHeading');
        const description = document.getElementById('homeHeroDescription');

        if (heading && homePage.heroTitle) {
            heading.textContent = homePage.heroTitle;
        }

        if (description && homePage.description) {
            description.textContent = homePage.description;
        }

        console.log('Home page content loaded from MongoDB');

    } catch (error) {
        console.error('Home CMS Error:', error);
    }
});