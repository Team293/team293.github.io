## SPIKE Scouting App

This is a scouting app for the 293 SPIKE team. It is designed to be used on a laptop or tablet, with minimal internet connection. It is designed to be used in a competition environment, where internet connection is limited and/or unreliable.

### PocketBase

The app uses the [Pocketbase](https://pocketbase.io/) database software to store data from scouting. The database can be accessed at [this URL](https://immense-scooter.pockethost.io/_). The database is password protected, and the password is available upon request.

### JSDoc

The code is documented using [JSDoc](https://jsdoc.app/). The documentation can be found [here](https://team293.github.io/source/spike-scouting-app/docs).

Generate JSdoc documentation in documentation folder:

```bash
jsdoc -r ./ -d ./documentation
```

## Events

These are all the events that can occur during a match (that we are tracking). Each event has a type, which is the name of the event, and a timestamp, which is the time the event occurred.

-   **Pick Up Game Piece:** Pick up a game piece (from: groud, loading station by dropping, loading station from sliding platform, loading station from chute)
-   **Drop Game Piece:** Drop a game piece on field.
-   **Score Game Piece:** Score a game piece in the scoring grid.
-   **Dislodged Game Piece:** Knock off game piece from the grid.
-   **Mobility Bonus:** Leave community area during autonomous.
-   **Disabled:** Robot is unable to move.
    -   **Fall Over:** Fall over during the match. (unnecessary?)
-   **Enabled:** Robot (re)enabled.
-   **Dock:** Dock with the charging station.
    -   **Engaged:** Engage with the charging station.
