const cardModule = require('./cardModule');

const listModule = {
    base_url: 'http://localhost:3000/lists',
    // fonction qui affiche la modale ajout d'une liste
    showAddListModal: () => {
        const modal = document.getElementById('addListModal');
        // afficher la modale en lui ajoutant une classe CSS du framework Bulma
        modal.classList.add('is-active');
      },
      
    // fonction qui permet de créer une liste dans le DOM
    makeListInDom: (list) => {
    // récupérer le template
    const templateList = document.getElementById('listTemplate');
    // en faire une copie
    const template = document.importNode(templateList.content, true);
    // const template = templateList.content.cloneNode(true);
   
    // changer le nom de la liste avec les données du formulaire
    const h2 = template.querySelector('h2');
    h2.textContent = list.name;

    // on attache l'évènement double click sur le titre de la liste
    h2.addEventListener('dblclick', listModule.showEditList);

    // on attache l'évènement submit au formulaire d'édition
    template.querySelector('.edit-list-form').addEventListener('submit', listModule.handleEditListForm);

    // on attache l'évènement click sur la poubelle
    template.querySelector('.icon-delete-list').addEventListener('click', listModule.deleteList);

    // changer l'id de la liste dans le DOM
    template.querySelector('.panel').dataset.listId = list.id;

    // changer l'id du hidden du form de modification
    template.querySelector('[name="list-id"]').value = list.id;

    // attacher un évènement click au bouton +
    template.querySelector('.panel a.icon-add-card').addEventListener('click', cardModule.showAddCardModal);

    // récupérer le container, c'est à dire l'élément HTML qui contiendra directement nos cartes
    const container = template.querySelector('.panel-block');
    console.log(container);
    new Sortable(container, {
      // on donne un nom au container qui contiendra nos cartes
      group: 'list',
      // on précise quels sont les éléments qu'on va pouvoir déplacer au sein des containers list, ici nos cartes
      draggable: '.box',
      // méthode qui sera déclenchée au relachement d'une carte
      onEnd: cardModule.moveCard
    });

    // insérer le template dans le DOM
    document.querySelector('.card-lists').appendChild(template);

  },
  showEditList: (event) => {
    // récupérer le formulaire d'édition
   const editForm = event.target.closest('.column').querySelector('.edit-list-form');
    // cacher le titre
    event.target.classList.add('is-hidden');
    // l'afficher
    editForm.classList.remove('is-hidden');
    
  },
  handleEditListForm: async (event) => {
    // empêcher le rechargement de la page
    event.preventDefault();
    // récupérer les données du formulaire
    const formData = new FormData(event.target);

    const h2 = event.target.closest('.column').querySelector('h2');
    // envoyer les données à l'API en PATCH
    try {
      await fetch(`${listModule.base_url}/${formData.get('list-id')}`, {
        method: 'PATCH',
        body: formData
      });
      // changer le nom de la liste dans le DOM
      h2.textContent = formData.get('name');
    } catch(error) {
      console.error(error);
      alert('Impossible de modifier la liste !');
    }
   
    // cacher le formulaire
    event.target.classList.add('is-hidden');
    // afficher le titre
    h2.classList.remove('is-hidden');
  },
  deleteList: async (event) => {
    const list = event.target.closest('.panel');
    // empêcher la suppression de la liste si des cartes existent !
    const card = list.querySelector('.box');
    if(card) return alert('Impossible de supprimer une liste contenant des cartes !');
    // demander la confirmation à l'utilisateur
    if(!confirm('Voulez-vous vraiment supprimer cette liste ?')) return;
    // supprimer la liste via l'API
    const listId = list.dataset.listId;
    if(isNaN(listId)) return alert("L'id de la liste n'est pas un nombre !");
    try {
      await fetch(`${listModule.base_url}/${listId}`, {
        method: 'DELETE'
      });
      // retirer la liste dans le DOM
      list.remove();
    } catch(error) {
      console.error(error);
      alert('Impossible de supprimer la liste !')
    }
    
  },
  moveList: (event) => {
   // récupérer toutes les listes
    const listsDOM = document.querySelectorAll('.panel');
    listsDOM.forEach(async (listDOM, index) => {
      // récupérer l'id de la liste
      const listId = listDOM.dataset.listId;
      // créer un FormData à passer à la requete PATCH (il n'y a pas de formulaire mais c'est pas grave)
      const formData = new FormData();
      // on lui donne des propriétés à la main via la méthode set. On le fait commencer à la position 1 pas à 0
      formData.set('position', ++index);
      // mettre à jour la liste via l'API
      try {
        await fetch(`${listModule.base_url}/${listId}`, {
          method: 'PATCH',
          body : formData
        });
      } catch(error) {
        console.error(error);
        alert('Impossible de déplacer la liste !');
      }
    });

  }
}

// pas de module.exports ici, on est pas dans node !
module.exports = listModule;