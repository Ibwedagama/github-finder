import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import { SEARCH_USERS, SET_LOADING, CLEAR_USERS, GET_USER, GET_REPOS } from '../Types';

const GithubState = (props) => {
	const initialState = {
		users: [],
		user: {},
		repos: [],
		loading: false,
	};

	let githubCliendId;
	let githubClientSecret;

	if (process.env.NODE_ENV != 'production') {
		githubCliendId = process.env.REACT_APP_GITHUB_CLIENT_ID;
		githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
	} else {
		githubCliendId = process.env.GITHUB_CLIENT_ID;
		githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
	}

	const [state, dispatch] = useReducer(GithubReducer, initialState);

	// SEARCH USERS
	// Search Github Users
	const searchUsers = async (text) => {
		setLoading();
		const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${githubCliendId}&client_secrect=${githubClientSecret}`);

		dispatch({
			type: SEARCH_USERS,
			payload: res.data.items,
		});
	};

	// GET SINGLE USER
	// Get single Github user
	const getUser = async (username) => {
		setLoading(true);

		const res = await axios.get(`https://api.github.com/users/${username}?client_id=${githubCliendId}&client_secrect=${githubClientSecret}`);

		dispatch({
			type: GET_USER,
			payload: res.data,
		});
	};

	// GET USERS

	// GET REPOS
	// Get User Repos
	const getUserRepos = async (username) => {
		setLoading(true);

		const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubCliendId}&client_secrect=${githubClientSecret}`);

		dispatch({
			type: GET_REPOS,
			payload: res.data,
		});
	};

	// CLEAR USER
	// Clearing the states
	const clearUsers = () => {
		dispatch({ type: CLEAR_USERS });
	};

	// SET LOADING
	const setLoading = () => {
		dispatch({ type: SET_LOADING });
	};

	return (
		<GithubContext.Provider
			value={{
				users: state.users,
				user: state.user,
				repos: state.repos,
				loading: state.loading,
				searchUsers,
				clearUsers,
				getUser,
				getUserRepos,
			}}
		>
			{props.children}
		</GithubContext.Provider>
	);
};

export default GithubState;
