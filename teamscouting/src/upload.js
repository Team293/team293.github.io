let authData = null;

class DatabaseConnector {
    constructor() {
        const PocketBase = window.PocketBase;
        this.pb = new PocketBase("https://immense-scooter.pockethost.io");
    }

    async authenticate(email, password) {
        console.log("Authenticating...");
        this.auth = await this.pb.admins
            .authWithPassword(email, password)
            .catch((err) => {
                console.log(
                    "Something went wrong. Likely invalid credentials."
                );
            });
    }

    async export() {}

    async generateMatch(match) {
        const pb = this.pb;
        if (!this.auth) {
            console.log("Not authenticated. Please authenticate first.");
            return;
        }

        // Loop over each team and generate the teams necessary data
        const redAlliance = [];
        const blueAlliance = [];

        console.log("RETRIEVING TEAMS...");
        // Join the red alliance and blue alliance into one array
        const teams = match.redAlliance.robots.concat(
            match.blueAlliance.robots
        );
        for await (const robot of teams) {
            const teamId = robot.team;
            // get team data from database
            let record = null;
            try {
                record = await pb
                    .collection("teams")
                    .getFirstListItem("teamNumber=" + teamId);
            } catch (err) {
                console.log("Team not found: " + teamId);
                console.log("Creating team...");

                const team = {
                    teamNumber: teamId,
                    teamName: "Team " + teamId,
                };
                record = await pb.collection("teams").create(team);
            }

            if (robot.alliance.color === RED) {
                redAlliance.push(record.id);
            } else {
                blueAlliance.push(record.id);
            }
        }

        const matchData = {
            date: new Date().toUTCString(),
            redAlliance,
            blueAlliance,
            matchData: JSON.parse(this.generateJSON(match)),
            matchType: match.matchType ?? undefined,
            compType: match.compType ?? undefined,
            matchNumber: match.matchNumber,
        };

        console.log("CREATING MATCH...");
        console.log(redAlliance, blueAlliance);

        const matchRecord = await pb
            .collection("matches")
            .create(matchData)
            .catch((err) => {
                throw new Error(
                    "Failed to create match: " + match.matchNumber,
                    err
                );
            });

        console.log("MATCH CREATED!");
    }

    generateJSON(match) {
        const date = new Date().toUTCString();
        const redAlliance = match.redAlliance.robots.map((robot) => {
            return robot.team;
        });

        const blueAlliance = match.blueAlliance.robots.map((robot) => {
            return robot.team;
        });

        const events = match.events.map((event) => {
            return {
                ...event,
                robot: event.robot.team,
                time: Math.round(event.time * 1000) / 1000,
                match: undefined,
            };
        });

        const matchType = match.matchType ?? undefined;
        const compType = match.compType ?? undefined;
        const matchNumber = match.matchNumber;

        const matchData = {
            date,
            redAlliance,
            blueAlliance,
            events,
            matchType,
            compType,
            matchNumber,
        };

        return JSON.stringify(matchData);
    }

    saveMatchToLocalStorage(match) {
        const matchData = this.generateJSON(match);
        const matchId = `MATCH-${match.compType}-${match.matchType}-${match.matchNumber}`;
        localStorage.setItem(matchId, matchData);
    }
}

async function generateTest() {
    const db = new DatabaseConnector();
    window.db = db;
    await db.authenticate(
        document.getElementById("email").value,
        document.getElementById("password").value
    );
}

window.generateTest = generateTest;
