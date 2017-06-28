"use strict";



module.exports = function () {

    RoomVisual.prototype.drawGlobal = function () {

        const
            BUFFER_WIDTH = 1,
            Y = 2,
            SECTION_WIDTH = 49 / 5,
            BAR_STYLE = this.barStyle,
            CPU_PERCENTAGE = Game.cpu.getUsed() / Game.cpu.limit,
            FUNCTIONAL_CPU_PERCENTAGE = Math.min(1, CPU_PERCENTAGE),
            BUCKET_PERCENTAGE = Game.cpu.bucket / 10000,
            GCL_PERCENTAGE = Game.gcl.progress / Game.gcl.progressTotal;


        let x = BUFFER_WIDTH;

        if (config.visuals.room) {

            // GCL
            x = BUFFER_WIDTH * 2 + SECTION_WIDTH;
            this.rect(x, Y - 0.75, SECTION_WIDTH, 1, BAR_STYLE);
            this.rect(x, Y - 0.75, GCL_PERCENTAGE * SECTION_WIDTH, 1, {
                fill: getColourByPercentage(GCL_PERCENTAGE, true),
                opacity: BAR_STYLE.opacity
            });
            this.text(`GCL: ${Game.gcl.level} (${(GCL_PERCENTAGE * 100).toFixed(2)}%)`, x + SECTION_WIDTH / 2, Y);

            // CPU
            x += SECTION_WIDTH + BUFFER_WIDTH;
            this.rect(x, Y - 0.75, SECTION_WIDTH, 1, BAR_STYLE);
            this.rect(x, Y - 0.75, FUNCTIONAL_CPU_PERCENTAGE * SECTION_WIDTH, 1, {
                fill: getColourByPercentage(FUNCTIONAL_CPU_PERCENTAGE),
                opacity: BAR_STYLE.opacity
            });
            this.text(`CPU: ${(CPU_PERCENTAGE * 100).toFixed(2)}%`, x + SECTION_WIDTH / 2, Y);

            // Bucket
            x += SECTION_WIDTH + BUFFER_WIDTH;
            this.rect(x, Y - 0.75, SECTION_WIDTH, 1, BAR_STYLE);
            this.rect(x, Y - 0.75, BUCKET_PERCENTAGE * SECTION_WIDTH, 1, {
                fill: getColourByPercentage(BUCKET_PERCENTAGE, true),
                opacity: BAR_STYLE.opacity
            });
            this.text(`Bucket: ${Game.cpu.bucket}`, x + SECTION_WIDTH / 2, Y);

            // Tick
            x += SECTION_WIDTH + BUFFER_WIDTH;
            this.text(`Tick: ${Game.time}`, x, Y, {align: 'left'});
        }
        if (config.visuals.cpu) {
            this.drawSparkline(undefined, 1.5, 46.5, 20, 2, _.map(Memory.visualStats.cpu, (v, i) => Memory.visualStats.cpu[i]), this.sparklineStyle);
        }
    };

    RoomVisual.prototype.drawSparkline = function (room, x, y, w, h, values, options) {
        _.forEach(options, option => {
            this.poly(_.map(values, (v, i) => [x + w * (i / (values.length - 1)), y + h * (1 - (v[option.key] - option.min) / (option.max - option.min))]), option);
        });
    };

    RoomVisual.prototype.drawRoomInfo = function (room) {
        let x,
            y = 0,
            text,
            rclPercentage;

        const
            ENERGY_PERCENTAGE = room.energyAvailable / room.energyCapacityAvailable || 0,
            BUFFER_WIDTH = 1,
            SECTION_WIDTH = 49 / 5,
            BAR_STYLE = this.barStyle;

        // Room Name, centered middle
        this.text(`Room: ${this.roomName} - totalCreeps: ${room.myCreeps.length}`, 24.5, ++y);


        // Display bars: RCL, GCL, CPU, Bucket, Tick #

        // RCL
        x = BUFFER_WIDTH;
        this.rect(x, ++y - 0.75, SECTION_WIDTH, 1, BAR_STYLE);

        if (room.controller.level === 8) {
            rclPercentage = 1;
            text = `RCL: 8`;
        } else if (room.controller.reservation) {
            rclPercentage = 0;
            text = `Reserved: ${room.controller.reservation.ticksToEnd}`;
        } else if (room.controller.owner) {
            rclPercentage = room.controller.progress / room.controller.progressTotal;
            text = `RCL: ${room.controller.level} (${(rclPercentage * 100).toFixed(2)}%)`;
        } else {
            rclPercentage = 0;
            text = `Unowned`;
        }
        rclPercentage = Math.min(1, rclPercentage);
        this.rect(x, y - 0.75, rclPercentage * SECTION_WIDTH, 1, {
            fill: getColourByPercentage(rclPercentage, true),
            opacity: BAR_STYLE.opacity
        });
        this.text(text, x + SECTION_WIDTH / 2, y);

        if (config.visuals.global) {
            // New line
            y += 1.5;
            x = BUFFER_WIDTH;
        } else
            x += SECTION_WIDTH + BUFFER_WIDTH;


        // Display Creep Count, Energy Available
        if (!room.controller.reservation) {
            this.rect(x, y - 0.75, SECTION_WIDTH, 1, BAR_STYLE);
            this.rect(x, y - 0.75, Math.min(1, ENERGY_PERCENTAGE) * SECTION_WIDTH, 1, {
                fill: getColourByPercentage(ENERGY_PERCENTAGE, true),
                opacity: BAR_STYLE.opacity
            });
            this.text(`Energy: ${room.energyAvailable}/${room.energyCapacityAvailable} (${(ENERGY_PERCENTAGE * 100).toFixed(2)}%)`, x + SECTION_WIDTH / 2, y);
        }
    };

    RoomVisual.prototype.drawSpawnInfo = function (spawn) {
        if (!spawn.spawning) return;
        this.text(`${spawn.spawning.name} (${((spawn.spawning.needTime - spawn.spawning.remainingTime) / spawn.spawning.needTime * 100).toFixed(1)}%)`,
            spawn.pos.x + 1,
            spawn.pos.y - 0.5,
            this.tooltipStyle);
    };

    RoomVisual.prototype.drawTowerInfo = function (tower) {
        this.text(`${tower.energy}/${tower.energyCapacity}`, tower.pos.x + 1, tower.pos.y - 0.5, this.barStyle);
    };

    RoomVisual.prototype.drawContainerInfo = function (container) {
        this.text(`${_.sum(container.store)}/2000`, container.pos.x + 1, container.pos.y + 1, this.barStyle);
    };

    RoomVisual.prototype.drawStorageInfo = function (storage) {

        let i = Math.ceil(Object.keys(storage.store).length / 3) * -1;

        Object.keys(storage.store).forEach(stuff => {
            i += 0.6;
            this.text(`${stuff}: ${storage.store[stuff]}`, storage.pos.x + 2, storage.pos.y + i, this.barStyle);

        });
    };

    RoomVisual.prototype.drawTerminalInfo = function (terminal) {

        let i = Math.ceil(Object.keys(terminal.store).length / 3) * -1;

        Object.keys(terminal.store).forEach(stuff => {
            i += 0.6;
            this.text(`${stuff}: ${terminal.store[stuff]}`, terminal.pos.x + 2, terminal.pos.y + i, this.barStyle);

        });
    };

    RoomVisual.prototype.drawMineralInfo = function (mineral) {
        let x = mineral.pos.x - 1;
        let y = mineral.pos.y - 1;
        if (mineral.mineralAmount)
            this.text(`Amount: ${formatNum(mineral.mineralAmount)}`, x, y, this.tooltipStyle);
        else
            this.text(`Regen: ${formatNum(mineral.ticksToRegeneration)}`, x, y, this.tooltipStyle);

    };

    RoomVisual.prototype.drawSourceInfo = function (source) {
        let x = source.pos.x - 1,
            y = source.pos.y - 1;

        if (source.energy)
            this.text(`Amount: ${source.energy}`, x, y, this.tooltipStyle);
        else
            this.text(`Regen: ${source.ticksToRegeneration}`, x, y, this.tooltipStyle);

    };



    function getColourByPercentage(percentage, reverse = false) {
        const
            value = reverse ? percentage : 1 - percentage,
            hue = (value * 120).toString(10);
        return `hsl(${hue}, 100%, 50%)`;
    }

    function formatNum(n) {

        if (n >= 1000000)
            return (n / 1000000).toFixed(2) + 'M';
        else if (n >= 1000)
            return (n / 1000).toFixed(1) + 'K';

        return n;
    }
};

