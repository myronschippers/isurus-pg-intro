$(document).ready(init);

function init() {
    console.log('Hello Isurus!!!');
    console.log('Would you like to play with some Code?');

    // event listeners
    $('.s-add-song-btn').on('click', clickAddNewSong);

    getSongs();
}

//
// EVENT HANDLERS
// ----------

function clickAddNewSong(event) {
    const newSongData = {};
    const $songInputs = $('.js-song-input');

    $songInputs.each(function(inputElement) {
        const elementDataKey = $(this).data().songKey;
        newSongData[elementDataKey] = $(this).val();
    });

    postSong(newSongData);
}

//
// API / Server connections
// ----------

function getSongs() {
    $.ajax({
        type: 'GET',
        url: '/api/songs',
    })
    .then(function(serverResponse) {
        render();
    })
    .catch(function(err) {
        console.log('Error getting songs: ', err);
        alert('There was an Error getting new songs.');
    });
}

function postSong(songData) {
    $.ajax({
        type: 'POST',
        url: '/api/songs',
        data: songData,
    })
    .then(function(serverResponse) {
        getSongs();
    })
    .catch(function(err) {
        console.log('Error posting song: ', err);
        alert('There was Error posting new song.');
    });
}

//
// DOM / View rendering
// ----------

function clearFields() {
    $('.js-song-input').val('');
}

function render (songsDataList) {
    const $songsList = $('.js-song-list');

    $songsList.empty();
    for (let song of songsDataList) {
        $songsList.append(`
            <li>
                <div class="songPill">
                    ${song.track},
                    <p>by: ${song.artist}</p> 
                    <p>published on: ${song.published}</p> 
                </div>
            </li>
        `);
    }
}