package de.hypertoc.API;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;

import javax.validation.constraints.NotNull;

/**
 * @author Georg Steinmetz <georgsteinmetz@web.de>
 */
public class HypertocApiConfiguration extends Configuration {
    @NotNull
    private int timeToFinishMove;

    @JsonProperty
    public int getTimeToFinishMove() {
        return timeToFinishMove;
    }

    @JsonProperty
    public void setTimeToFinishMove(int timeToFinishMove) {
        this.timeToFinishMove = timeToFinishMove;
    }
}
