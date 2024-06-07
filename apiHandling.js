const apiKey = '0ba1bc5be40c496cbbae828d1ab61cf5';
const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

async function fetchNews(type = 'general') {
    try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?category=${type}&language=en&pageSize=100&apiKey=${apiKey}`;
        console.log("Fetching news from URL:", apiUrl); // Debug log
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("Fetched news data:", data);
        return filterEnglishArticles(data.articles);
    } catch (error) {
        console.error("Error fetching news.", error);
        return [];
    }
}

async function fetchNewsQuery(query) {
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&language=en&pageSize=100&apiKey=${apiKey}`;
        console.log("Fetching news by query from URL:", apiUrl); // Debug log
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("Fetched news data by query:", data);
        return filterEnglishArticles(data.articles);
    } catch (error) {
        console.error("Error fetching news by query.", error);
        return [];
    }
}

function filterEnglishArticles(articles) {
    return articles.filter(article => article.language === 'en' || !article.language);
}

function displayBlogs(articles) {
    blogContainer.innerHTML = "";
    if (articles.length === 0) {
        //blogContainer.innerHTML = "<p>No news articles found.</p>";
        return;
    }
    articles.forEach((article) => {
        if (!article.description || !article.title || !article.url || !article.urlToImage) {
            return;
        }
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        if (article.urlToImage && article.urlToImage.trim() !== "") {
            const img = document.createElement("img");
            img.src = article.urlToImage;
            img.alt = article.title;
            blogCard.appendChild(img);
        } else {
            const imgPlaceholder = document.createElement("div");
            imgPlaceholder.classList.add("image-placeholder");
            blogCard.appendChild(imgPlaceholder);
        }

        const title = document.createElement("h2");
        const truncatedTitle = article.title.length > 50 ? article.title.slice(0, 50) + "...." : article.title;
        title.textContent = truncatedTitle;

        const description = document.createElement("p");
        if (article.description) {
            const truncatedDes = article.description.length > 70 ? article.description.slice(0, 70) + "...." : article.description;
            description.textContent = truncatedDes;
        } else {
            description.textContent = "No description available";
        }

        blogCard.appendChild(title);
        blogCard.appendChild(description);
        blogCard.addEventListener('click', () => {
            window.open(article.url, "_blank");
        });
        blogContainer.appendChild(blogCard);
    });
}

searchButton.addEventListener("click", async () => {
    const query = searchField.value.trim();
    console.log("Search button clicked, query:", query); // Debug log
    if (query !== "") {
        try {
            const articles = await fetchNewsQuery(query);
            displayBlogs(articles);
        } catch (error) {
            console.log("Error fetching news by query", error);
        }
    } else {
        console.log("Search field is empty.");
    }
});

document.querySelectorAll('.menu-head').forEach(menuItem => {
    menuItem.addEventListener('click', async () => {
        const type = menuItem.getAttribute('data-type');
        console.log("Menu item clicked, type:", type); // Debug log
        try {
            const articles = await fetchNews(type);
            displayBlogs(articles);
        } catch (error) {
            console.error("Error fetching news by category.", error);
        }
    });
});

(async () => {
    try {
        const articles = await fetchNews();
        displayBlogs(articles);
    } catch (error) {
        console.error("Error fetching general news.", error);
    }
})();
