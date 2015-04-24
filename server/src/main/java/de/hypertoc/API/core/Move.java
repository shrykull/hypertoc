package de.hypertoc.API.core;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

/**
 * Created by Georg on 04.12.2014.
 *
 * @author Georg
 */
public class Move {
    @Min(1)
    @Max(9)
    private int x;
    @Min(1)
    @Max(9)
    private int y;
    private Player player;

    public int getX() {
        return x;
    }

    @JsonProperty("col")
    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    @JsonProperty("line")
    public void setY(int y) {
        this.y = y;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    @JsonProperty("playerId")
    public void setPlayerById(int playerId) {
        setPlayer(new Player(playerId));
    }
}
