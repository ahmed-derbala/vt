let invalidUrl = document.getElementById('url');
let editBtns = Array.from(document.querySelectorAll('.edit'));
let editMode = false;
let editValues = {};
let materialSelect = false;
let selectsMenu = [];
let inputsMenu = [];
let checkboxMenu = [];

invalidUrl.oninvalid = function(e) {
  e.target.setCustomValidity('');
  if (!e.target.validity.valid) {
    e.target.setCustomValidity('Le lien doit commencer https:// ou http://');
  }
};
invalidUrl.oninput = function(e) {
  e.target.setCustomValidity('');
};

let setBodyPadding = () => {
  document.querySelector('body').style.paddingTop =
    document.querySelector('.naawen-navbar').clientHeight + 'px';
  document.querySelector('body').style.paddingBottom =
    document.querySelector('.naawen-footer').clientHeight + 40 + 'px';
};
setBodyPadding();

window.addEventListener('resize', setBodyPadding);

let seeMoreBtns = Array.from(document.getElementsByClassName('card'));
let showRestStatus = Array.from(
  { length: seeMoreBtns.length },
  (v, i) => false
);
let drawerOpen = false;

const toggle = (text, index) => {
  showRestStatus[index] = !showRestStatus[index];
  if (showRestStatus[index]) {
    event.target.parentElement.querySelector(
      '.card-description'
    ).innerHTML = text;
    event.target.innerHTML = 'Voir moins';
  } else {
    event.target.parentElement.querySelector(
      '.card-description'
    ).innerHTML = text.slice(0, 200);
    event.target.innerHTML = 'Voir plus';
  }
};

function openNav() {
  document.getElementById('mySidenav').style.width = '100%';
  document.getElementById('mySidenav').style.maxWidth = '450px';
  document.getElementById('overlay').style.display = 'block';
  document.querySelector('html').style.overflow = 'hidden';
}

function closeNav() {
  document.getElementById('mySidenav').style.width = '0';
  document.getElementById('overlay').style.display = 'none';
  document.querySelector('html').style.overflow = 'auto';
  document.getElementById('sidenav-form').reset();
  Array.from(
    document.getElementById('mySidenav').querySelectorAll(`select`)
  ).map(select => {
    Array.from(select.children).map((option, i) => {
      if (i > 0) {
        option.removeAttribute('selected');
      } else {
        option.setAttribute('selected', 'true');
      }
    });
  });
  document.querySelector('.sidenav-select-menu').innerHTML = '';
  editMode = false;
}

document.getElementById('overlay').addEventListener('click', closeNav);

let typeSelect = document.getElementById('type');

const renderSelectMenu = () => {
  materialSelect = editMode
    ? editValues['type'].toLowerCase() === 'materiel'
    : event.target.value.toLowerCase() === 'materiel';
  if (!materialSelect)
    document.querySelector('.sidenav-select-menu').innerHTML = `<div>
          <label for="service" class="required">service</label>
          <select id="service" name="service" required class="sidenav-select">
            <option value="">
              Selectionner une option
            </option>
            <option value="Agent de services hospitaliers (ASH)">
              Agent de services hospitaliers (ASH)
            </option>
            <option value="Aide-soignant">Aide-soignant</option>
            <option value="Algorithmie">Algorithmie</option>
            <option value="Ambulancier">Ambulancier</option>
            <option value="Anesthésiste-réanimateur">
              Anesthésiste-réanimateur
            </option>
            <option value="Assistante social">Assistante social</option>
            <option value="Autre compétence ou service">
              Autre compétence ou service
            </option>
            <option value="Auxiliaire de puériculture">
              Auxiliaire de puériculture
            </option>
            <option value="Biologie médicale">Biologie médicale</option>
            <option value="Cancérologue">Cancérologue</option>
            <option value="Cardiologue">Cardiologue</option>
            <option value="Chirurgien">Chirurgien</option>
            <option value="Chirurgien-dentiste">Chirurgien-dentiste</option>
            <option value="Communication">Communication</option>
            <option value="Conciergerie">Conciergerie</option>
            <option value="Coordination des soins">Coordination des soins</option>
            <option value="Cybersécurité">Cybersécurité</option>
            <option value="Dermatologue">Dermatologue</option>
            <option value="Design">Design</option>
            <option value="Diabétologue">Diabétologue</option>
            <option value="Diagnostic">Diagnostic</option>
            <option value="Endocrinologue">Endocrinologue</option>
            <option value="Epidémiologie">Epidémiologie</option>
            <option value="Formation">Formation</option>
            <option value="Garde d'enfants">Garde d'enfants</option>
            <option value="Gastro-entérologue">Gastro-entérologue</option>
            <option value="Généticien">Généticien</option>
            <option value="Gériatre">Gériatre</option>
            <option value="Gestion de crise">Gestion de crise</option>
            <option value="Gynécologue">Gynécologue</option>
            <option value="Hébergement">Hébergement</option>
            <option value="Hématologue">Hématologue</option>
            <option value="Hépatologue">Hépatologue</option>
            <option value="Infectiologue">Infectiologue</option>
            <option value="Infirmier anesthésiste diplômé d’Etat (IADE)">
              Infirmier anesthésiste diplômé d’Etat (IADE)
            </option>
            <option value="Infirmier d’Accueil et d’Orientation (IAO)">
              Infirmier d’Accueil et d’Orientation (IAO)
            </option>
            <option value="Infirmier de bloc opératoire diplômé d’Etat (IBODE)">
              Infirmier de bloc opératoire diplômé d’Etat (IBODE)
            </option>
            <option value="Infirmier diplômé d’Etat (IDE)">
              Infirmier diplômé d’Etat (IDE)
            </option>
            <option value="Infographiste">Infographiste</option>
            <option value="Kinésithérapeute">Kinésithérapeute</option>
            <option value="Logistique">Logistique</option>
            <option value="Management">Management</option>
            <option value="Manipulateur radio">Manipulateur radio</option>
            <option value="Médecin généraliste">Médecin généraliste</option>
            <option value="Médecin régulateur">Médecin régulateur</option>
            <option value="Montage vidéo">Montage vidéo</option>
            <option value="Néphrologue">Néphrologue</option>
            <option value="Neurologue">Neurologue</option>
            <option value="Ophtalmologiste">Ophtalmologiste</option>
            <option value="ORL">ORL</option>
            <option value="Pédiatre">Pédiatre</option>
            <option value="Pharmacien">Pharmacien</option>
            <option value="Pneumologue">Pneumologue</option>
            <option value="Préparateur en pharmacie">
              Préparateur en pharmacie
            </option>
            <option value="Programmation mobile">Programmation mobile</option>
            <option value="Programmation web">Programmation web</option>
            <option value="Psychiatre">Psychiatre</option>
            <option value="Psychologue">Psychologue</option>
            <option value="Ressources humaines (RH)">
              Ressources humaines (RH)
            </option>
            <option value="Retour à domicile">Retour à domicile</option>
            <option value="Rhumatologue">Rhumatologue</option>
            <option value="Santé publique">Santé publique</option>
            <option value="Service à domicile">Service à domicile</option>
            <option value="Soins à domicile">Soins à domicile</option>
            <option value="Soutien psychologique">Soutien psychologique</option>
            <option value="Technicien de laboratoire médical">
              Technicien de laboratoire médical
            </option>
            <option value="Télémédecine">Télémédecine</option>
            <option value="Transport">Transport</option>
            <option value="Urgentiste">Urgentiste</option>
            <option value="Urologue">Urologue</option>
          </select>
        </div>`;
  else
    document.querySelector('.sidenav-select-menu').innerHTML = `<div>
        <label for="equipment" class="required">Matériels </label>
        <select
          name="equipment"
          id="equipment"
          class="sidenav-select"
          required
        >
        <option value="">
        Selectionner un matériel
      </option>
          <option value="Autre matériel" class="option" data-value="19">
            Autre matériel
          </option>
          <option value="Camion" class="option" data-value="15">
            Camion
          </option>
          <option value="Défibrillateur" class="option" data-value="13">
            Défibrillateur
          </option>
          <option value="Echographe" class="option" data-value="17">
            Echographe
          </option>
          <option value="ECMO" class="option" data-value="16">
            ECMO
          </option>
          <option value="Gants" class="option" data-value="6">
            Gants
          </option>
          <option value="Imprimante 3D" class="option" data-value="11">
            Imprimante 3D
          </option>
          <option
            value="Lits de soins intensifs et réanimation"
            class="option"
            data-value="10"
          >
            Lits de soins intensifs et réanimation
          </option>
          <option value="Logement" class="option" data-value="20">
            Logement
          </option>
          <option value="Masques" class="option" data-value="5">
            Masques
          </option>
          <option value="Optiflow" class="option" data-value="14">
            Optiflow
          </option>
          <option value="Pousse-seringue" class="option" data-value="8">
            Pousse-seringue
          </option>
          <option value="Repas" class="option" data-value="18">
            Repas
          </option>
          <option value="Sur-blouses" class="option" data-value="9">
            Sur-blouses
          </option>
          <option
            value="Ventilation artificielle"
            class="option"
            data-value="7"
          >
            Ventilation artificielle
          </option>
          <option value="Voiture" class="option" data-value="12">
            Voiture
          </option>
        </select>
        <label for="equipmentCount" class="required">Quantités de matériels</label>
        <input
          type="number"
          name="equipmentCount"
          id="equipmentCount"
          class="sidenav-input"
          placeholder="Détaillez la quantité du matériel"
          required
        />
      </div>`;
};
typeSelect.addEventListener('change', () => {
  editMode = false;
  renderSelectMenu();
});

document.getElementById('mySidenav').addEventListener('transitionend', () => {
  if (editMode) {
    document.getElementById('sidenav-form').action = '/game/update/';
    document.getElementById('sidenav-form').method = 'get';

    renderSelectMenu();
    editItem(editValues);
    document.getElementById('action-btn').innerHTML = `
    <input type="hidden" name="id" id="id" value=${editValues._id}>
    <input type="submit" value="éditer" class="btn naawen-drawer-submit" />
    `;
  } else {
    document.getElementById('sidenav-form').action = '/game/create';
    document.getElementById('sidenav-form').method = 'POST';
    document.getElementById('action-btn').innerHTML = `
    <button type="submit" class="btn naawen-drawer-submit">
    Soumettre
  </button>
    `;
  }
});

const editItem = x => {
  if (typeof x === 'string') {
    editValues = JSON.parse(x.split('+++').join('"'));
  }
  openNav();
  editMode = true;
  selectsMenu = Array.from(document.querySelectorAll('.sidenav-select'));
  inputsMenu = Array.from(document.querySelectorAll('.sidenav-input'));
  inputsMenu.map(
    el => (document.getElementById(el.id).value = editValues[el.id])
  );
  checkboxMenu = Array.from(document.querySelectorAll('.sidenav-checkbox'));
  checkboxMenu.map(el => (el.checked = el.id === editValues.creatorKind));

  selectsMenu.map(el => {
    if (typeof editValues[el.id] === 'object') {
      editValues[el.id].map(selectedOption => {
        document
          .querySelector(`option[value='${selectedOption}']`)
          .setAttribute('selected', 'true');
      });
    } else {
      document
        .querySelector(`option[value='${editValues[el.id]}']`)
        .setAttribute('selected', 'true');
    }
  });

  // document.getElementById('photo').files = editValues.img.data
  // document.getElementById('photo').files = ev.dataTransfer.files;
};

editBtns.map(btn => btn.addEventListener('click', editItem));
