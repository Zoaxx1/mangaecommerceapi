const express = require('express');
const uuid = require('uuid');
const mangasData = require('../data/mangas');
const routerManga = express.Router();

// Middleware
const listMangasMid = (req, res, next) => {
    const param = req.params.manga ?? req.params.editorial ?? req.params.author ?? req.params.gender;
    const property = req.params.manga ? 'title' : req.params.gender ? 'gender' : req.params.editorial ? 'editorial' : 'author'
    const mangas = mangasData.filter((manga) => manga[property].toLowerCase().split(' ').join('') === param);
    if(!mangas.length){
        return res.send('No se encontró el manga solicitado', 400);
    }
    req.mangas = mangas;
    next();
}

routerManga.get('/', (req, res) => {
    return res.send(JSON.stringify(mangasData));
})

// GET -----------------------------------------------------------------------
// Mangas by title and volume
// If it is per volume or id, one is sent
// The ID have more priority
routerManga.get('/:manga', listMangasMid, (req, res) => {
    const {volume, id} = req.query;
    if((!volume || volume === 'unique') && !id){
        return res.send(JSON.stringify(req.mangas));
    }
    return res.send(JSON.stringify(req.mangas.find((manga) => {
        let isTheManga = false;
        if(volume){
            isTheManga = manga.volume === Number(volume);
        }
        if(id){
            isTheManga = manga.id.toString() === id;
        }
        return isTheManga;
    })));
})

// Mangas by genre
routerManga.get('/gender/:gender', listMangasMid, (req, res) => {
    return res.send(JSON.stringify(req.mangas));
})

// Mangas by editorial
routerManga.get('/editorial/:editorial', listMangasMid, (req, res) => {
    return res.send(JSON.stringify(req.mangas));
})

// Mangas by author
routerManga.get('/author/:author', listMangasMid, (req, res) => {
    return res.send(JSON.stringify(req.mangas));
})

// POST -----------------------------------------------------------------------

routerManga.post('/', (req, res) => {
    const newManga = {...req.body, id: uuid.v4()};
    mangasData.push(newManga);
    res.send(JSON.stringify(mangasData));
})

// DELETE ---------------------------------------------------------------------

routerManga.delete('/:id', (req, res) => {
    const id = req.params.id;
    const index = mangasData.findIndex((manga) => manga.id.toString() === id);
    if(index >= 0){
        mangasData.splice(index, 1);
    }
    return res.send(JSON.stringify(mangasData));
})

// PUT ----------------------------------------------------------------------

// TODO
routerManga.put('/:id', (req, res) => {
    const updatedManga = req.body;
    const id = req.params.id;
    const index = mangasData.findIndex((manga) => manga.id === id);
    if(index >= 0){
        const manga = mangasData[index];
        mangasData[index] = {...manga, ...updatedManga};
    }
    return res.send(JSON.stringify(mangasData[index]));
})

// USE ------------------------------------------------------------------------
routerManga.use(listMangasMid);

module.exports = routerManga;