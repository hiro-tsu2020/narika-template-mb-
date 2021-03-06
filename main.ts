basic.showIcon(IconNames.Heart)
basic.forever(function () {
    if (NARIKA.operatorLightLevel(NARIKA.NarikaOperator.GreaterThan, 50)) {
        NARIKA.switchOff(NARIKA.NarikaSwitch.One)
    } else {
        NARIKA.switchOn(NARIKA.NarikaSwitch.One)
    }
})
