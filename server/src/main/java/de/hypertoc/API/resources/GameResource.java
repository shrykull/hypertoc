package de.hypertoc.API.resources;

import de.hypertoc.API.core.Game;
import de.hypertoc.API.core.Move;
import de.hypertoc.API.core.Player;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Map;
import java.util.UUID;

/**
 * Created by Georg on 04.12.2014.
 *
 * @author Georg
 */

@Path("/game")
@Produces(MediaType.APPLICATION_JSON)
public class GameResource {
    public final char[][] field;
    private Map<UUID, Game> games;

    public GameResource(Map<UUID, Game> games) {
        this.games = games;

        field = generateField();
    }

    @Path("/{gameId}")
    @GET
    public Response getGame(@PathParam("gameId") UUID gameId) {
        // check if game exists
        if (!games.containsKey(gameId)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(games.get(gameId)).build();
    }

    @POST
    public Game createGame() {
        UUID id = UUID.randomUUID();
        while (games.containsKey(id)) {
            id = UUID.randomUUID();
        }
        Game result = new Game(id, generateField());
        games.put(id, result);
        return result;
    }

    @Path("/{gameId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @PUT
    public Response gameMove(@PathParam("gameId") UUID gameId, Move move) {
        // check if game exists
        if (!games.containsKey(gameId)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Game game = games.get(gameId);
        Player player = move.getPlayer();

        // check if its the users turn
        if (game.getActivePlayer() != player.getId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        move.setPlayer(player);
        if (!game.makeMove(move)) {
            return Response.status(Response.Status.CONFLICT).build();
        }

        return Response.ok(game).build();
    }

    @Path("/{gameId}")
    @DELETE
    public Response deleteGame(@PathParam("gameId") UUID gameId) {
        if (!games.containsKey(gameId)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        games.remove(gameId);
        return Response.ok().build();
    }

    private char[][] generateField() {
        char[][] result = new char[9][9];
        for (int i = 0; i < 9; i++) {
            for (int k = 0; k < 9; k++) {
                result[i][k] = ' ';
            }
        }
        return result;
    }
}
