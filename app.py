from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/profile/<username>")
def profile(username):
    user_url = f"https://api.github.com/users/{username}"
    repo_url = f"https://api.github.com/users/{username}/repos"

    user_response = requests.get(user_url)

    if user_response.status_code != 200:
        return jsonify({"error": "GitHub user not found"}), 404

    user = user_response.json()

    repo_response = requests.get(repo_url)
    repos = repo_response.json()

    total_stars = 0
    total_forks = 0
    language_count = {}

    repo_list = []

    for repo in repos:
        stars = repo["stargazers_count"]
        forks = repo["forks_count"]
        language = repo["language"]

        total_stars += stars
        total_forks += forks

        if language:
            language_count[language] = language_count.get(language, 0) + 1

        repo_list.append({
            "name": repo["name"],
            "language": language,
            "stars": stars,
            "forks": forks,
            "url": repo["html_url"]
        })

    data = {
        "avatar": user["avatar_url"],
        "name": user.get("name"),
        "username": user["login"],
        "bio": user.get("bio"),
        "company": user.get("company"),
        "location": user.get("location"),
        "followers": user["followers"],
        "following": user["following"],
        "repos": user["public_repos"],
        "profile": user["html_url"],
        "stars": total_stars,
        "forks": total_forks,
        "languages": language_count,
        "repo_list": repo_list
    }

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
