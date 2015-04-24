package de.hypertoc.API;

import de.hypertoc.API.core.Game;
import de.hypertoc.API.health.GameHealthCheck;
import de.hypertoc.API.resources.GameResource;
import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * @author Georg Steinmetz <georgsteinmetz@web.de>
 */
public class HypertocApiApplication extends Application<HypertocApiConfiguration> {
    private static Map<UUID, Game> games;

    public static void main(String[] args) throws Exception {
        new HypertocApiApplication().run(args);
    }

    @Override
    public String getName() {
        return "Hypertoc API";
    }

    @Override
    public void initialize(Bootstrap<HypertocApiConfiguration> bootstrap) {
        games = new HashMap<>();
    }

    @Override
    public void run(HypertocApiConfiguration configuration, Environment environment) throws Exception {
        final GameHealthCheck healthCheck = new GameHealthCheck();
        environment.healthChecks().register("game", healthCheck);

        final GameResource resource = new GameResource(games);
        environment.jersey().register(resource);
    }
}
