import React from 'react';

const UserLogin = () => {
	return (
		<div>
			<h2>Login</h2>

			<form
				action='/login'
				method='post'>
				<div>
					<label for='username'>Username:</label>
					<input
						type='text'
						id='username'
						name='username'
						required></input>
				</div>

				<div>
					<label for='password'>Password:</label>
					<input
						type='password'
						id='password'
						name='password'
						required></input>
				</div>

				<div>
					<button type='submit'>Login</button>
				</div>
			</form>
		</div>
	);
};

export default UserLogin;
