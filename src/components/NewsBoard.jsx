import { useEffect, useState } from "react";
import NewsItem from "./NewsItem";

function NewsBoard({category}){

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const pageSize = 10; // Number of articles per page

    useEffect(() => {
        const fetchNews = async () => {
            const apiKey = "a1813f3ce83349d2a8c2a21f106bd6a1";
            const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                setArticles(data.articles || []);
                setTotalResults(data.totalResults);
            } catch (error) {
                console.error("Error fetching news:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [category, page]);

    const totalPages = Math.ceil(totalResults / pageSize);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center">Error fetching news: {error.message}</div>;
    }

    return (
        <>
            <h2 className="text-center my-4">Latest <span className="badge bg-danger">News</span></h2>


            {articles.map((news, index) => (
                <NewsItem 
                    key={index}
                    title={news.title}
                    description={news.description}
                    src={news.urlToImage}
                    url={news.url}
                />
            ))}

            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center my-5">
                    <li className={`page-item ${page === 1 && 'disabled'}`}>
                        <button className="page-link" onClick={() => handlePageChange(page - 1)}>Previous</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i + 1} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${page === totalPages && 'disabled'}`}>
                        <button className="page-link" onClick={() => handlePageChange(page + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default NewsBoard;