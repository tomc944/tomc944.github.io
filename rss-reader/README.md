This is my first foray into the power of progressive web apps. I designed
a simple RSS reader that displays the top 10 most recent articles posted
amongst all the subscribed feeds.

Service workers cache the application shell in order to work offline or with
spotty internet connection.

All articles are stored client-side using the localforage API to store
via IndexDB, Web SQL, or local storage.
