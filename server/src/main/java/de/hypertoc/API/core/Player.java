package de.hypertoc.API.core;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

/**
 * Created by Georg on 04.12.2014.
 *
 * @author Georg
 */
public class Player {
    @Min(0)
    @Max(1)
    private int id;

    public Player() {
    }

    public Player(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    @JsonProperty("playerId")
    public void setId(int id) {
        this.id = id;
    }

    public char getSymbol() {
        return id == 0 ? 'X' : 'O';
    }
}
