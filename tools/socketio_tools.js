exports.rooms = () => {
    var activeRooms = [];
    Object.keys(io.sockets.adapter.rooms).forEach(room => {
        var isRoom = true;
        Object.keys(io.sockets.adapter.sids).forEach(id => {
            isRoom = (id === room) ? false : isRoom;
        });
        if (isRoom) activeRooms.push(room);
    });
    return activeRooms;
}