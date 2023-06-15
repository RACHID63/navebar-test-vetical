let id = 0;

function ajouterLigne(event) {
  event.preventDefault();
  
  var nomPoste = document.getElementById("nomPosteInput").value;
  var adresseEntreprise = document.getElementById("adresseEntrepriseInput").value;
  var candidatureEnvoyee = document.getElementById("candidatureEnvoyeeInput").value;
  
  if (nomPoste === "" || adresseEntreprise === "" || candidatureEnvoyee === "") {
    alert("Veuillez remplir tous les champs");
    return;
  }
  
  var tableau = document.getElementById("tableau");
  var nouvelleLigne = tableau.insertRow(-1);
  
  var caseACocher = document.createElement("input");
  caseACocher.type = "checkbox";
  nouvelleLigne.insertCell(0).appendChild(caseACocher);
  
  nouvelleLigne.insertCell(1).textContent = nomPoste;
  nouvelleLigne.insertCell(2).textContent = adresseEntreprise;
  nouvelleLigne.insertCell(3).textContent = candidatureEnvoyee;
  
  var ligne = {
    id: id++,
    nomPoste: nomPoste,
    adresseEntreprise: adresseEntreprise,
    candidatureEnvoyee: candidatureEnvoyee
  };
  
  nouvelleLigne.dataset.id = ligne.id;
  
  var lignesEnregistrees = JSON.parse(localStorage.getItem("candidatures")) || [];
  lignesEnregistrees.push(ligne);
  localStorage.setItem("candidatures", JSON.stringify(lignesEnregistrees));
  
  document.getElementById("nomPosteInput").value = "";
  document.getElementById("adresseEntrepriseInput").value = "";
  document.getElementById("candidatureEnvoyeeInput").value = "";

  rendreCellulesModifiables();
}

function supprimerSelection() {
  var casesCoches = document.querySelectorAll("#tableau input[type='checkbox']:checked");
  
  if (casesCoches.length === 0) {
    alert("Veuillez sélectionner au moins une ligne à supprimer");
    return;
  }
  
  var tableau = document.getElementById("tableau");
  
  var lignesEnregistrees = JSON.parse(localStorage.getItem("candidatures")) || [];
  
  for (var i = casesCoches.length - 1; i >= 0; i--) {
    var ligne = casesCoches[i].parentNode.parentNode;
    tableau.deleteRow(ligne.rowIndex);
    
    var id = ligne.dataset.id;
    var index = lignesEnregistrees.findIndex(function(ligneEnregistree) {
      return ligneEnregistree.id == id;
    });
    if (index !== -1) {
      lignesEnregistrees.splice(index, 1);
    }
  }
  
  localStorage.setItem("candidatures", JSON.stringify(lignesEnregistrees));
}

function rendreCellulesModifiables() {
  var cellules = document.querySelectorAll("#tableau td");
  for (var i = 0; i < cellules.length; i++) {
    cellules[i].setAttribute("contenteditable", "true");
  }
}

window.addEventListener("DOMContentLoaded", function() {
  var lignesEnregistrees = JSON.parse(localStorage.getItem("candidatures")) || [];
  var tableau = document.getElementById("tableau");
  
  for (var i = 0; i < lignesEnregistrees.length; i++) {
    var ligneEnregistree = lignesEnregistrees[i];
    
    if (ligneEnregistree.id >= id) {
      id = ligneEnregistree.id + 1;
    }
    
    var nouvelleLigne = tableau.insertRow(-1);
    
    var caseACocher = document.createElement("input");
    caseACocher.type = "checkbox";
    nouvelleLigne.insertCell(0).appendChild(caseACocher);
    
    nouvelleLigne.insertCell(1).textContent = ligneEnregistree.nomPoste;
    nouvelleLigne.insertCell(2).textContent = ligneEnregistree.adresseEntreprise;
    nouvelleLigne.insertCell(3).textContent = ligneEnregistree.candidatureEnvoyee;
    
    nouvelleLigne.dataset.id = ligneEnregistree.id;
  }
  
  rendreCellulesModifiables();
});


function sauvegarderSelection() {
  var lignesEnregistrees = JSON.parse(localStorage.getItem("candidatures")) || [];

  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lignesEnregistrees));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "candidatures.json");
  document.body.appendChild(downloadAnchorNode); // nécessaire pour le rendu du lien sur Firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// Ajoutez un gestionnaire d'événement à votre bouton sauvegarder
window.addEventListener("DOMContentLoaded", function() {
  var boutonSauvegarder = document.querySelector(".sauvegarder");
  boutonSauvegarder.addEventListener("click", sauvegarderSelection);
  // ...
});

function rendreCellulesModifiables() {
  var cellules = document.querySelectorAll("#tableau td");
  for (var i = 0; i < cellules.length; i++) {
    cellules[i].setAttribute("contenteditable", "true");

    // Ajouter un écouteur d'événements qui se déclenche lorsque l'utilisateur finit d'éditer une cellule
    cellules[i].addEventListener("blur", function() {
      var ligne = this.parentNode;
      var colonnes = ligne.querySelectorAll("td");

      var id = ligne.dataset.id;

      var lignesEnregistrees = JSON.parse(localStorage.getItem("candidatures")) || [];

      // Trouver la ligne correspondante dans lignesEnregistrees
      var index = lignesEnregistrees.findIndex(function(ligneEnregistree) {
        return ligneEnregistree.id == id;
      });

      // Mettre à jour la valeur dans lignesEnregistrees
      if (index !== -1) {
        lignesEnregistrees[index].nomPoste = colonnes[1].textContent;
        lignesEnregistrees[index].adresseEntreprise = colonnes[2].textContent;
        lignesEnregistrees[index].candidatureEnvoyee = colonnes[3].textContent;

        // Sauvegarder lignesEnregistrees dans le stockage local
        localStorage.setItem("candidatures", JSON.stringify(lignesEnregistrees));
      }
    });
  }
}

// Ajouter à la fin de votre fichier JavaScript

// Modifier la fonction de tri pour gérer à la fois le tri croissant et décroissant
function trierParCandidatureEnvoyee(croissant) {
  var lignes = Array.from(document.getElementById("tableau").rows).slice(1); // On ignore la ligne d'en-tête
  lignes.sort(function(a, b) {
    var candidatureA = new Date(a.cells[3].textContent);
    var candidatureB = new Date(b.cells[3].textContent);

    // Comparer les dates
    if (candidatureA < candidatureB) {
      return croissant ? -1 : 1;
    } else if (candidatureA > candidatureB) {
      return croissant ? 1 : -1;
    } else {
      return 0;
    }
  });

  var tableau = document.getElementById("tableau");
  for (var i = 0; i < lignes.length; i++) {
    tableau.appendChild(lignes[i]);
  }
}

// Modifier l'écouteur d'événements pour distinguer entre un clic simple et un double clic
window.addEventListener("DOMContentLoaded", function() {
  var header = document.getElementById("candidatureEnvoyeeHeader");

  var clickTimeout = false;
  header.addEventListener("click", function() {
    if (clickTimeout !== false) {
      // Si un clic a déjà été détecté dans les 250 dernières millisecondes, c'est un double clic
      clearTimeout(clickTimeout);
      clickTimeout = false;
      trierParCandidatureEnvoyee(false); // Tri décroissant pour un double clic
    } else {
      // Si aucun clic n'a été détecté dans les 250 dernières millisecondes, on enregistre le clic et on attend
      clickTimeout = setTimeout(function() {
        trierParCandidatureEnvoyee(true); // Tri croissant pour un clic simple
        clickTimeout = false;
      }, 250);
    }
  });
});


// Attacher l'écouteur d'événements à l'en-tête de la colonne
window.addEventListener("DOMContentLoaded", function() {
  var header = document.getElementById("candidatureEnvoyeeHeader");
  header.addEventListener("click", trierParCandidatureEnvoyee);
});



