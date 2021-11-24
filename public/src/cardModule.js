const tagModule = require('./tagModule');

const cardModule = {
  base_url: 'http://localhost:3000/cards',
    // fonction qui affiche la modale d'ajout d'une carte dans une liste
    showAddCardModal: (event) => {
        const modal = document.getElementById('addCardModal');
        // mettre à jour list_id du formulaire de la modale pour pouvoir envoyer l'id de la liste lors de la soumission du formulaire
        modal.querySelector('input[type="hidden"]').value = event.target.closest('.panel').dataset.listId;
        modal.classList.add('is-active');
      },
      // fonction qui créé une carte dans une liste (DOM)
      makeCardInDom: (card) => {
        // recuperer le template
        const templateCard = document.getElementById('cardTemplate');
        // créer le clone du template
        const template = document.importNode(templateCard.content, true);
        // on récupère la carte du template
        const cardDOM = template.querySelector('.box');
        // on modifie le titre de la carte
        cardDOM.querySelector('.column').textContent = card.title;
        // on modifie la couleur de fond de la carte
        cardDOM.style.backgroundColor = card.color;
        //on modifie l'id de la carte dans le DOM
        cardDOM.dataset.cardId = card.id;

        // on modifie l'id du champs input hidden dans le form de modification
        cardDOM.querySelector('[name="card-id"]').value = card.id;

        cardDOM.querySelector('.icon-edit-card').addEventListener('click', cardModule.showEditCard);

        cardDOM.querySelector('.icon-delete-card').addEventListener('click', cardModule.deleteCard);

        cardDOM.querySelector('.edit-card-form').addEventListener('submit', cardModule.handleEditCardForm);

        // on applique un évènement clic au bouton d'ajout de tag
        cardDOM.querySelector('.icon-add-tag').addEventListener('click', tagModule.showAddTagForm);

        cardDOM.querySelector('.add-tag-form').addEventListener('submit', tagModule.associateTagToCard);

        if(card.tags) {
          // créé ses tags dans le DOM
          for(const tag of card.tags) {
            tagModule.makeTagInDom(tag, cardDOM);
          }
        }
        
        // insérer la carte dans la bonne liste (on récupère la bonne liste via son attribut html data-list-id)
        const list = document.querySelector(`[data-list-id="${card.list_id}"]`);
        list.querySelector('.panel-block').appendChild(template);
      },
      showEditCard: (event) => {
        const card = event.target.closest('.box');
        const editForm = card.querySelector('.edit-card-form');
        // mettre dans le champs title le nom de la carte par défaut
        const cardTitleDOM = card.querySelector('.card-title');
        editForm.querySelector('[name="title"]').value = cardTitleDOM.textContent;
        // cacher le titre de la carte
        cardTitleDOM.classList.add('is-hidden');
        // afficher le formulaire d'édition
        editForm.classList.remove('is-hidden');
      },
      handleEditCardForm: async (event) => {
        // empêcher le rechargement de la page
        event.preventDefault();
        // récupérer la data du formulaire
        const formData = new FormData(event.target);
        const card = event.target.closest('.box');
        const cardTitle = card.querySelector('.card-title');
        try {
          // modifier la carte dans l'API
          await fetch(`${cardModule.base_url}/${formData.get('card-id')}`, {
            method: 'PATCH',
            body: formData
          });
          // modifier le nom de la carte dans le DOM
          cardTitle.textContent = formData.get('title');
          // modifier la couleur de la carte dans le DOM
          card.style.backgroundColor = formData.get('color');
        } catch(error) {
          console.error(error);
          alert('Impossible de modifier la carte !')
        }
        // cacher le formulaire
        event.target.classList.add('is-hidden');
        // faire reapparaitre le nom de la carte
        cardTitle.classList.remove('is-hidden');
      },
      deleteCard: async (event) => {
        // demander la confirmation à l'utilisateur
        if(!confirm("Voulez-vous vraiment supprimer cette carte ?")) return;

        try {
          const card = event.target.closest('.box');
          // récupérer l'id de la carte
          const cardId = card.dataset.cardId;
          // supprimer la carte via l'API
          await fetch(`${cardModule.base_url}/${cardId}`, {
            method: 'DELETE'
          });
          
          // supprimer la carte dans le DOM
          card.remove();
        } catch(error) {
          console.error(error);
          alert('Impossible de supprimer la carte !');
        }
        
      },
      moveCard: async (event) => {
        const card = event.item;
        const originList = event.from;
        const newList = event.to;

        // récupérer l'id de la nouvelle liste
        // const listId = newList.closest('.panel').dataset.listId;
       
        // à partir de la liste d'origine on va récupérer les cartes
        let cards = originList.querySelectorAll('.box');
        await cardModule.updatePositionCards(cards);
        cards = newList.querySelectorAll('.box');
        await cardModule.updatePositionCards(cards);
        
      },
      updatePositionCards: async (cards) => {
        cards.forEach(async (card, index) => {
          // récupérer l'id de la carte
          const cardId = card.dataset.cardId;
          const listId = card.closest('.panel').dataset.listId;
          const formData = new FormData();
          formData.set('position', ++index);
          formData.set('list_id', listId);
           // call API /cards/cardId
          try {
            await fetch(`${cardModule.base_url}/${cardId}`, {
              method: 'PATCH',
              body: formData
            });
          } catch(error) {
            console.error(error);
            alert('Impossible de déplacer la carte !');
          }
        });
      }
}

// pas de module.exports ici, on est pas dans node !
// ah bah... on utilise browserify du coup on peut !

module.exports = cardModule;

