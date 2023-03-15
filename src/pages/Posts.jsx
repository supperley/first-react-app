import React, { useEffect, useRef, useState } from "react";
import PostFilter from "../components/PostFilter";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import MyButton from "../components/UI/button/MyButton";
import MyModal from "../components/UI/MyModal/MyModal";
import PostService from "../API/PostService";
import { usePosts } from "../hooks/usePosts";
import { useFetching } from "../hooks/useFetching";
import { getPagesCount, getPagesArray } from "../utils/pages";
import "../styles/App.css";
import Loader from "../components/UI/Loader/Loader";
import Pagination from "../components/UI/pagination/Pagination";
import MySelect from "../components/UI/select/MySelect";
import useObserver from "../hooks/useObserver";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState({ sort: "", query: "" });
    const [modal, setModal] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const lastElement = useRef();

    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);

    const [fetchPosts, isPostsLoading, postError] = useFetching(
        async (limit, page) => {
            console.log("callback");
            const response = await PostService.getAll(limit, page);
            setPosts([...posts, ...response.data]);
            const totalCount = response.headers["x-total-count"];
            setTotalPages(getPagesCount(totalCount, limit));
        }
    );

    useObserver(lastElement, page < totalPages, isPostsLoading, () => {
        setPage(page + 1);
    });

    useEffect(() => {
        fetchPosts(limit, page);
    }, [page]);

    const createPost = (newPost) => {
        setPosts([...posts, newPost]);
        setModal(false);
    };

    const removePost = (post) => {
        setPosts(posts.filter((p) => p.id !== post.id));
    };

    const changePage = (page) => {
        setPage(page);
    };

    return (
        <div className="App">
            <MyButton
                style={{ marginTop: 30 }}
                onClick={() => {
                    setModal(true);
                }}
            >
                Создать пользователя
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost}></PostForm>
            </MyModal>
            <hr style={{ margin: "15px 0" }}></hr>
            <PostFilter filter={filter} setFilter={setFilter}></PostFilter>
            <MySelect
                value={limit}
                onChange={(value) => {
                    setLimit(value);
                }}
                defaultValue="Кол-во элементов на странице"
            ></MySelect>
            {postError && <h1>Произошла ошибка ${postError}</h1>}

            <PostList
                posts={sortedAndSearchedPosts}
                remove={removePost}
                title="Посты про JS"
            ></PostList>
            <div
                ref={lastElement}
                style={{ height: 20, background: "red" }}
            ></div>
            {isPostsLoading && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 50,
                    }}
                >
                    <Loader></Loader>
                </div>
            )}
            <Pagination
                page={page}
                changePage={changePage}
                totalPages={totalPages}
            ></Pagination>
        </div>
    );
}

export default Posts;
