package de.hypertoc.API.core;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Created by Georg on 04.12.2014.
 *
 * @author Georg <georgsteinmetz@web.de>
 */
public class Game {
    private UUID id;
    private int activePlayer;
    private char[][] field;

    public Game() {
    }

    public Game(UUID id, char[][] field) {
        this.id = id;
        this.field = field;
        this.activePlayer = (Math.random() < 0.5) ? 0 : 1;
    }

    @JsonProperty
    public UUID getId() {
        return id;
    }

    @JsonProperty
    public int getActivePlayer() {
        return activePlayer;
    }

    public void setActivePlayer(int activePlayer) {
        this.activePlayer = activePlayer;
    }

    @JsonProperty
    public List<List<String>> getField() {
        List<List<String>> result = new ArrayList<>();
        for (char[] line : field) {
            List<String> temp = new ArrayList<>();
            for (char col : line) {
                temp.add(String.valueOf(col));
            }
            result.add(temp);
        }
        return result;
    }

    public boolean makeMove(Move move) {
        int x = move.getX() - 1;
        int y = move.getY() - 1;

        if (field[y][x] != ' ') {
            return false;
        }

        field[y][x] = move.getPlayer().getSymbol();
        toggleActivePlayer();
        return true;
    }

    private void toggleActivePlayer() {
        activePlayer = (activePlayer == 0) ? 1 : 0;
    }
}
