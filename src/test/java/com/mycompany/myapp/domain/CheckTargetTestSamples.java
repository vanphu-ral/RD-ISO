package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CheckTargetTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static CheckTarget getCheckTargetSample1() {
        return new CheckTarget().id(1L).name("name1").status("status1").updateBy("updateBy1");
    }

    public static CheckTarget getCheckTargetSample2() {
        return new CheckTarget().id(2L).name("name2").status("status2").updateBy("updateBy2");
    }

    public static CheckTarget getCheckTargetRandomSampleGenerator() {
        return new CheckTarget()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString());
    }
}
