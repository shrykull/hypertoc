/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.hypertoc.API.health;

import com.codahale.metrics.health.HealthCheck;

/**
 * @author Georg Steinmetz <georg.steinmetz@1und1.de>
 */
public class GameHealthCheck extends HealthCheck {

    @Override
    protected Result check() throws Exception {
        return Result.healthy();
    }

}
