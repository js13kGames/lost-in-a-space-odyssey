/* Tuple structure */
// 0: x
// 1: y
// 2: radius
// 3: angle (in degrees)
// 4: force X
// 5: force Y
// 6: shoot timer
// 7: Acceleration

function updateEnemy(e, params, j){
    // Update angle to player
    e[3] = angleTo(e, player).toDeg();
    // Set forces depending on distance to player
    var distanceToPlayer = distanceTo(e, player),
        maxVel = 25;
    // If too far... accelerate to ship
    if(distanceToPlayer > 100){
        if(Math.abs(e[4]) <= maxVel){
            e[4] += e[7] * Math.cos(e[3].toRad()) * dt;
        }
        if(Math.abs(e[5]) <= maxVel){
            e[5] += e[7] * Math.sin(e[3].toRad()) * dt;
        }
    }
    // If too near... go inverse
    else{
        if(Math.abs(e[4]) <= maxVel){
            e[4] -= e[7] * Math.cos(e[3].toRad()) * dt;
        }
        if(Math.abs(e[5]) <= maxVel){
            e[5] -= e[7] * Math.sin(e[3].toRad()) * dt;
        }
    }
    // Max forces correction
    if(e[4] > maxVel){
        e[4] = maxVel;
    }else if(e[4] < -maxVel){
        e[4] = -maxVel;
    }
    if(e[5] > maxVel){
        e[5] = maxVel;
    }else if(e[5] < -maxVel){
        e[5] = -maxVel;
    }

    // Go where forces say
    e[0] += e[4] * dt;
    e[1] += e[5] * dt;


    // Shoot if timer and distance
    if(distanceToPlayer < 110 && e[6] < t){
        // SFX
        play(AeShot);

        e[6] = t + random(1, 7); // timer  + cadence
        var cannonPosition = getOrbitPosition(e, e[3], e[2]+12);
        enemyBullets.push(
            [
                cannonPosition[0],
                cannonPosition[1],
                12,
                random(e[3] - 7, e[3] + 7),
                80,
                t + 2.5,
                t + 0.05
            ]
        ); // 0 x, 1 y, 2 radius, 3 angle, 4 vel, 5 timer end, 6 timer resize
    }

    // If collides with player bullet, destroy
    for( var i = playerBullets.length - 1 ; i >= 0; --i){
        var distanceToPlayerBullet = distanceTo(e, playerBullets[i]);
        if(distanceToPlayerBullet <= 0){
            // Sound
            play(Aexplosion2);
            // Particles when die
            for(var i = 8; i >= 0; --i){
                var particle = [
                        e[0],
                        e[1],
                        random(e[2] / 2, e[2]),
                        random(0, 360),
                        random(7, 25),
                        t + random(0.6, 1.0),
                        1,
                        [14],
                        2
                    ];
                spawnParticle(particle);
            }
            // Remove
            playerBullets.splice(i--, 1);
            enemies.splice(j--, 1);
        }
    }
}

function drawEnemy(e){
    // Draw cannon
    setContextAtrribute(14, 0);
    drawLine(e[0], e[1], e[3], 38, 6);
    setContextAtrribute(14, 1);
    var op = getOrbitPosition(e, e[3], e[2]);
    fillCircle(op[0], op[1], 8);
    // Draw body
    fillCircle(e[0], e[1], e[2]);
    // Draw some external lines
    ctx.lineWidth = 1;
    setContextAtrribute(17, 0);
    strokeCircle(e[0], e[1], e[2] - 2);
    strokeCircle(e[0], e[1], e[2] - 5);
    // Draw inside cabin
    setContextAtrribute(18, 1);
    fillRectangle(e[0] - 15, e[1] - 8, 30, 16);
    // Draw alien
    // Body
    setContextAtrribute(4, 1);
    fillRectangle(e[0] - 4, e[1], 8, 8);
    // Aerials
    fillRectangle(e[0] - 4, e[1] - 4, 2, 4);
    fillRectangle(e[0] + 2, e[1] - 4, 2, 4);
    // Eyes
    setContextAtrribute(9, 1);
    fillRectangle(e[0] - 3, e[1] + 2, 3, 3);
    fillRectangle(e[0] + 3, e[1] + 2, 3, 3);
}

function createEnemies( number ){
    for(var i = number - 1; i >= 0; --i){
        var randomPosition = getOrbitPosition(player, random(0, 360), random(W, W + 256)),
        enemy = [
            randomPosition[0],
            randomPosition[1],
            24,
            0,
            0,
            0,
            t + 5,
            100,
        ];
        enemies.push( enemy );
    }
}
