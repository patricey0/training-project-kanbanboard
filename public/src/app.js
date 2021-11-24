// app est le module central de notre application. Il appelle les autres modules mais les autres modules ne doivent pas l'appeler. Ca nous sera utile pour l'épisode 5 de cette saison. #noSpoil
// vu qu'on utilise browserify, il va falloir importer les modules avec require !
const listModule = require('./listModule');
const cardModule = require('./cardModule');
const tagModule = require('./tagModule');

// on objet qui contient des fonctions
const app = {
  // on renseigne le lien de l'API
  base_url: 'http://localhost:3000',

  // fonction d'initialisation, lancée au chargement de la page
  init: () => {
    // on appelle la méthode qui attache les évènements à nos éléments sur la page
    app.addListenerToActions();
    app.getListsFromAPI();
  },
  addListenerToActions: () => {
    // récupérer le bouton ajouter une liste
    const btnModal = document.getElementById('addListButton');
    // attache un évènement clique sur le bouton pour déclencher l'affichage de la modale
    btnModal.addEventListener('click', listModule.showAddListModal);

    /* Même chose : 
    document.getElementById('addListButton').addEventListener('click', app.showAddListModal);
    */

    // récupère LES éléments avec la clas close (les boutons pour fermer les modals)
    const btnsClose = document.getElementsByClassName('close');
    // même chose : const btnsClose = document.querySelectorAll('.close');
    for (const btn of btnsClose) {
      // pour chaque bouton attache un évènement clique qui déclenche la fermeture de la modale affichée
      btn.addEventListener('click', app.hideModals);
    }

    // on récupère le formulaire de la modale d'ajout de liste
    const addListForm = document.querySelector('#addListModal form');
    // puis on lui attache un évènement de soumission
    addListForm.addEventListener('submit', app.handleAddListForm);

    /*
    const addCardBtns = document.querySelectorAll('.panel a.is-pulled-right');
    for(const btn of addCardBtns) {
      btn.addEventListener('click', app.showAddCardModal);
    } */

    const addCardForm = document.querySelector('#addCardModal form');
    addCardForm.addEventListener('submit', app.handleAddCardForm);


  },
  hideModals: () => {
    // récupérer LES modales
    const modals = document.getElementsByClassName('modal');

    // leur enlever la class is-active pour les cacher
    for (const modal of modals) {
      modal.classList.remove('is-active');
    }
  },
  handleAddListForm: async (event) => {

    // empêcher le rechargement de la page
    event.preventDefault();
    // capturer la donnée (nom de la liste) du formulaire
    // ici on passe event.target c'est à dire le formulaire qui a été soumis et qui a donc déclenché l'évènement submit
    const formData = new FormData(event.target);

    try {
      // envoie les infos du formulaire à l'API pour qu'elle nous créé la liste et nous la renvoie
      const result = await fetch(`${app.base_url}/lists`, {
        method: 'POST',
        body: formData
      });

      const list = await result.json();

      // result.ok c'est pareil que result.status === 200 jusqu'à 299
      if (result.ok) {
        // générer une nouvelle liste dans le DOM
        listModule.makeListInDom(list);
      }

    } catch (error) {
      console.error(error);
      alert('Impossible de créer la carte !');
    }

    // fermer la modale
    app.hideModals();

  },
  handleAddCardForm: async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log('Contenu de formData : ', formData);
    try {
      // contacter l'API pour insérer la carte en base et nous la renvoyer
      const result = await fetch(`${app.base_url}/cards`, {
        method: 'POST',
        body: formData
      });

      const card = await result.json();

      cardModule.makeCardInDom(card);
    } catch (error) {
      console.error(error);
      alert('Impossible de créer la carte !');
    }

    app.hideModals();
  },
  // fonction qui call l'API pour récupérer les listes avec cartes et tags
  getListsFromAPI: async () => {
    try {
      // on contact l'API pour récupérer les listes avec tout leur contenu
      const result = await fetch(`${app.base_url}/lists`);
      // pour récupérer la data, il faut exécuter la méthode json() sur le result de fetch
      const lists = await result.json();
      // boucler sur les listes pour les afficher dans le DOM
      for (const list of lists) {
        // créer les listes dans le DOM
        listModule.makeListInDom(list);
        // on boucle sur cards pour pouvoir créer les cartes dans le DOM
        for (const card of list.cards) {
          // créer chaque carte dans le DOM
          cardModule.makeCardInDom(card);
          // for(const tag of card.tags) {
          //   tagModule.makeTagInDom(tag, card.id);
          // }
        }
      }
      const container = document.querySelector('.card-lists');
      new Sortable(container, {
        draggable: '.panel',
        onEnd: listModule.moveList
      });

      // on parcours toutes les cartes pour leur remplir le formulaire d'ajout de tag
      const cards = document.querySelectorAll('.box');
      for(const card of cards) {
        const selectDOM = card.querySelector('.select-tag');
        // remplit le select avec les balises option (tags)
        tagModule.fillAddTagForm(selectDOM);
      }


    } catch (error) {
      console.error(error);
    }
  }

};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);