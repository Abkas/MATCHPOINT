import mongoose from 'mongoose';


const SlotSchema = new Schema({
    futsal: { 
        type: Schema.Types.ObjectId,
        ref: 'Futsal',
        required: true
        },
    date: {
        type: String,
         required: true 
        }, 
    time: {
        type: String,
        required: true
        },
    players: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Player' 
        }
    ],
    maxPlayers: {
        type: Number,
        default: 10 
    },
    isFull: { 
        type: Boolean,
         default: false 
        },
    price:{
        type: Number,
        required: true
    },
    paymentStatus: [
        { 
        playerId: {
            type: Schema.Types.ObjectId,
            ref: 'Player' 
        },
        paid: Boolean 
        }
    ],
    bookedOffline: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true });

SlotSchema.methods.isFull = function () {
    return this.players.length >= this.maxPlayers;
};

SlotSchema.methods.addPlayer = function (playerId) {
    if (!this.isFull()) {
        this.players.push(playerId);
        return this.save();
    }
    throw new Error('Slot is full');
};

SlotSchema.methods.removePlayer = function (playerId) {
    this.players.pull(playerId);
    return this.save();
};

SlotSchema.methods.getPlayersCount = function () {
    return this.players.length;
};

SlotSchema.methods.getAvailableSlots = function () {
    return this.maxPlayers - this.players.length;
};

SlotSchema.methods.getPaymentStatus = function (playerId) {
    const status = this.paymentStatus.find(status => status.playerId.toString() === playerId.toString());
    return status ? status.paid : false;
};

SlotSchema.methods.getPlayersJoined = function () {
    return this.players;
}

export const Slot = mongoose.model('Slot', SlotSchema);