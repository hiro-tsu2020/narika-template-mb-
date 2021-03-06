/**

NARIKA.getTemperature()
 * NARIKA テンプレート
 */

/**
 * カスタムブロック
 */
//% weight=100 color=#0fbc11 icon="\uf0c3" block="電気の利用(MB-Ⅱ)"
namespace NARIKA {

    /**
     * 演算子タイプ
     */
    export enum NarikaOperator {
        //% blockId="narika_eq" block="="
        Equal,
        //% blockId="narika_noteq" block="≠"
        NotEqual,
        //% blockId="narika_lt" block="<"
        LessThan,
        //% blockId="narika_lteq" block="≦"
        LessThanOrEqual,
        //% blockId="narika_gt" block=">"
        GreaterThan,
        //% blockId="narika_gteq" block="≧"
        GreaterThanOrEqual,
    }

    /**
     * スイッチタイプ
     */
    export enum NarikaSwitch {
        //% block="スイッチ 1"
        One,
        //% block="スイッチ 2"
        Two
    }

    /** スイッチの状態 */
    let narikaSwitchStatus = [0, 0];

    /**
     * サーボモーターを回転させてスイッチを ON にします。
     * @param s 操作スイッチ
     */
    //% blockId="switch_on"
    //% weight=100 block="%s|を ON にする"
    export function switchOn(s: NarikaSwitch): void {
        let degree = 10;
        let onValue = 2;
        switch (s) {
            case NarikaSwitch.One:
                if (narikaSwitchStatus[NarikaSwitch.One] != onValue) {
                    pins.servoWritePin(AnalogPin.P1, degree);
                    basic.pause(1000)
                    narikaSwitchStatus[NarikaSwitch.One] = onValue;
                    pins.digitalWritePin(DigitalPin.P1, 0)
                }
                break;
            case NarikaSwitch.Two:
                if (narikaSwitchStatus[NarikaSwitch.Two] != onValue) {
                    pins.servoWritePin(AnalogPin.P2, degree);
                    basic.pause(1000)
                    narikaSwitchStatus[NarikaSwitch.Two] = onValue;
                    pins.digitalWritePin(DigitalPin.P2, 0)
                }
                break;
        }
    }

    /**
     * サーボモーターを回転させてスイッチを OFF にします。
     * @param s 操作スイッチ
     */
    //% blockId="switch_off"
    //% weight=90 block="%s|を OFF にする"
    export function switchOff(s: NarikaSwitch): void {
        let degree = 90;
        let offValue = 1;
        switch (s) {
            case NarikaSwitch.One:
                if (narikaSwitchStatus[NarikaSwitch.One] != offValue) {
                    pins.servoWritePin(AnalogPin.P1, degree);
                    basic.pause(1000)
                    narikaSwitchStatus[NarikaSwitch.One] = offValue;
                    pins.digitalWritePin(DigitalPin.P1, 0)
                }
                break;
            case NarikaSwitch.Two:
                if (narikaSwitchStatus[NarikaSwitch.Two] != offValue) {
                    pins.servoWritePin(AnalogPin.P2, degree);
                    basic.pause(1000)
                    narikaSwitchStatus[NarikaSwitch.Two] = offValue;
                    pins.digitalWritePin(DigitalPin.P2, 0)
                }
                break;
        }
    }

    /**
     * 温度を取得します。
     */
    //% blockId="get_temperature"
    //% weight=80 block="外部温度"
    export function getTemperature(): number {
        let ad = pins.analogReadPin(AnalogPin.P0);
        let adTable = [51, 66, 84, 105, 131, 161, 195, 233, 274, 319, 366, 414, 463, 512.0, 559, 604, 647, 687, 723, 756, 787, 813, 837, 859, 878, 894, 909, 922, 933, 943];
        let adIndex = 0;
        for (adIndex = 0; adIndex < adTable.length; adIndex++) {
            if (ad < adTable[adIndex]) {
                break;
            }
        }
        if (adIndex == 0 || adIndex == adTable.length) {
            return 0;
        }

        let temperature = (((adIndex - 1) * 5) - 40);
        let adMin = adTable[adIndex - 1];
        let adMax = adTable[adIndex];
        let adStep = (adMax - adMin) / 5;
        for (let index = 0; index < 5; index++) {
            if ((adStep * index) + adMin >= ad) {
                break;
            }
            temperature++;
        }

        return temperature;
    }


    /**
     * 温度を表示します。
     */
    //% blockId="show_temperature"
    //% weight=70 block="外部温度を表示"
    export function showTemperature(): void {
        let temp = getTemperature();
        basic.showNumber(temp);
    }

    /* 人が動いたブロック */
    //% blockId="human_detection"
    //% weight=80 block="人が動いた"
    export function humanDetection(): boolean {
        if (pins.digitalReadPin(DigitalPin.P2) == 1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 外部温度と指定の値を比較します。
     * @param op    条件
     * @param value 比較する値
     * @returns 条件の結果の boolean 値
     */
    //% blockId="operatorTemperature"
    //% weight=60 block="外部温度 %op| %value"
    export function operatorTemperature(op: NarikaOperator, value: number): boolean {
        let temperature = getTemperature();
        return operatorValue(op, temperature, value);
    }


    /**
     * 明るさと指定の値を比較します。
     * @param op    条件
     * @param value 比較する値
     * @returns 条件の結果の boolean 値
     */
    //% blockId="operatorLightLevel"
    //% weight=50 block="明るさ %op| %value"
    export function operatorLightLevel(op: NarikaOperator, value: number): boolean {
        let lightLevel = input.lightLevel();
        return operatorValue(op, lightLevel, value);
    }


    function operatorValue(op: NarikaOperator, baseValue: number, checkValue: number): boolean {
        switch (op) {
            case NarikaOperator.Equal: return baseValue == checkValue;
            case NarikaOperator.NotEqual: return baseValue != checkValue;
            case NarikaOperator.LessThan: return baseValue < checkValue;
            case NarikaOperator.LessThanOrEqual: return baseValue <= checkValue;
            case NarikaOperator.GreaterThan: return baseValue > checkValue;
            case NarikaOperator.GreaterThanOrEqual: return baseValue >= checkValue;
        }
        return false;
    }


}
