const tagModule = {
    base_url: 'http://localhost:3000',
    dissociateTagFromCard: async (event) => {
        // récupérer l'id du tag et l'id de la carte
        const tagId = event.target.dataset.tagId;
        const cardId = event.target.closest('.box').dataset.cardId;
        // call API en DELETE sur /cards/cardId/tags/tagId
        try {
            await fetch(`${tagModule.base_url}/cards/${cardId}/tags/${tagId}`, {
                method: 'DELETE'
            });
            // supprimer le tag du front
            event.target.remove();
        } catch(error) {
            console.error(error);
            alert('Impossible de dissocier le tag de la carte !');
        }
    },
    // récupère tous les tags via un call API
    getAllTags: async () => {
        try {
             // faire un call API en GET sur /tags
            const response = await fetch(`${tagModule.base_url}/tags`);
            const tags = await response.json();
            // retourne tous les tags
            return tags;
        } catch(error) {
            console.error(error);
            alert('Impossible de récupérer les tags !');
        }
    },
    // remplit le select du formulaire d'ajout de tag avec des balises option comportant les tags 
    fillAddTagForm: async (selectDOM) => {
        // récupérer tous les tags
        const tags = await tagModule.getAllTags();
        // on boucle sur chaque tags
        for(const tag of tags) {
            // pour chaque tag créer une balise option
            const option = document.createElement('option');
            // indiquer son contenu textuel (ce que verra l'utilisateur)
            option.textContent = tag.name;
            // indique l'id du tag en tant que value (ce qui permet d'identifier un tag et qui pourra être utile lors d'un ca   ll API)
            option.value = tag.id;
            // ajouter la balise option dans le select
            selectDOM.appendChild(option);
        }
    },
    // affiche le formulaire d'ajout de tag
    showAddTagForm: (event) => {
        // récupère le formulaire d'ajout de tag
        const form = event.target.closest('.box').querySelector('.add-tag-form');
        // on l'affiche
        form.classList.remove('is-hidden');
    },
    // associer un tag à une carte
    associateTagToCard: async (event) => {
        // on empêche le rechargement de la page puisque c'est un évènement submit
        event.preventDefault();
        const cardDOM = event.target.closest('.box');
        // récupérer cardId
        const cardId = cardDOM.dataset.cardId;
        // récupérer les données du formulaire (comprenant tag_id) et l'envoyer en réponse à l'API
        const formData = new FormData(event.target);
        try {
            // call API en POST sur /cards/cardId/tags
            const response = await fetch(`${tagModule.base_url}/cards/${cardId}/tags`, {
                method: 'POST',
                body: formData
            });
            // on recupère le tag
            const tag = await response.json();
            // cacher le formulaire d'ajout de tag
            event.target.classList.add('is-hidden');
            // afficher le tag dans la carte (DOM)
            tagModule.makeTagInDom(tag, cardDOM);
        }
        catch(error) {
            console.error(error);
            alert("Impossible d'associer ce tag à cette carte !");
        }        

    },
    makeTagInDom: (tag, cardDOM) => {
         // on créé la div qui va contneir le tag. Pas besoin de template car il s'agit ici d'une simple div qui ne contient aucun autre élément HTML
         const tagDOM = document.createElement('div');
         // on lui ajoute la class tag de Bulma
         tagDOM.classList.add('tag');
         // on lui ajoute sa couleur de fond
         tagDOM.style.backgroundColor = tag.color;
         // on indique son nom
         tagDOM.textContent = tag.name;
         // on applique son id via un data attribute
         tagDOM.dataset.tagId = tag.id;
         // on attache un évènement pour dissocier le tag de la liste
         tagDOM.addEventListener('dblclick', tagModule.dissociateTagFromCard);
         // on l'insère dans la carte (DOM)
         cardDOM.appendChild(tagDOM);
    }
}

module.exports = tagModule;