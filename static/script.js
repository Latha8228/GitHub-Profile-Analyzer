let chart = null;

async function loadProfile() {

    const username = document.getElementById("username").value.trim();

    if(username===""){
        alert("Please enter a GitHub username");
        return;
    }

    const error=document.getElementById("error");
    error.innerHTML="";

    try{

        const response=await fetch(`/profile/${username}`);

        const data=await response.json();

        if(data.error){
            error.innerHTML="GitHub User Not Found!";
            document.getElementById("profile").classList.add("hidden");
            return;
        }

        document.getElementById("profile").classList.remove("hidden");

        document.getElementById("avatar").src=data.avatar;
        document.getElementById("name").innerHTML=data.name || "No Name";
        document.getElementById("bio").innerHTML=data.bio || "No Bio";
        document.getElementById("login").innerHTML=data.username;
        document.getElementById("company").innerHTML=data.company || "-";
        document.getElementById("location").innerHTML=data.location || "-";

        document.getElementById("followers").innerHTML=data.followers;
        document.getElementById("following").innerHTML=data.following;
        document.getElementById("repos").innerHTML=data.repos;
        document.getElementById("stars").innerHTML=data.stars;
        document.getElementById("forks").innerHTML=data.forks;

        document.getElementById("githubLink").href=data.profile;

        //------------------------
        // Repository Table
        //------------------------

        let rows="";

        data.repo_list.forEach(repo=>{

            rows+=`
            <tr>
                <td>
                    <a href="${repo.url}" target="_blank">
                        ${repo.name}
                    </a>
                </td>
                <td>${repo.language || "-"}</td>
                <td>${repo.stars}</td>
                <td>${repo.forks}</td>
            </tr>
            `;

        });

        document.getElementById("repoTable").innerHTML=rows;

        //------------------------
        // Pie Chart
        //------------------------

        const labels=Object.keys(data.languages);
        const values=Object.values(data.languages);

        if(chart){
            chart.destroy();
        }

        chart=new Chart(document.getElementById("languageChart"),{

            type:"pie",

            data:{
                labels:labels,
                datasets:[{
                    data:values
                }]
            },

            options:{
                responsive:true,
                plugins:{
                    legend:{
                        labels:{
                            color:"white"
                        }
                    }
                }
            }

        });

    }

    catch(err){

        error.innerHTML="Something went wrong.";

    }

}
