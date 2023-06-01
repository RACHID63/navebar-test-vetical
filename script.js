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

  // Enregistrement dans le localStorage
  var ligne = {
    nomPoste: nomPoste,
    adresseEntreprise: adresseEntreprise,
    candidatureEnvoyee: candidatureEnvoyee
  };
  
  var lignesEnregistrees = JSON.parse(localStorage.getItem("candidatures")) || [];
  lignesEnregistrees.push(ligne);
  localStorage.setItem("candidatures", JSON.stringify(lignesEnregistrees));
  
  // Effacer les valeurs des champs d'entrée
  document.getElementById("nomPosteInput").value = "";
  document.getElementById("adresseEntrepriseInput").value = "";
  document.getElementById("candidatureEnvoyeeInput").value = "";
}

function supprimerSelection() {
  var casesCoches = document.querySelectorAll("#tableau input[type='checkbox']:checked");
  
  if (casesCoches.length === 0) {
    alert("Veuillez sélectionner au moins une ligne à supprimer");
    return;
  }
  
  var tableau = document.getElementById("tableau");
  
  for (var i = casesCoches.length - 1; i >= 0; i--) {
    var ligne = casesCoches[i].parentNode.parentNode;
    tableau.deleteRow(ligne.rowIndex);
  }
  
  // Suppression dans le localStorage
  var lignesEnregistrees = JSON.parse(localStorage.getItem("candidatures")) || [];
  
  for (var i = lignesEnregistrees.length - 1; i >= 0; i--) {
    var ligneEnregistree = lignesEnregistrees[i];
    var index = i + 1; // L'index dans le tableau est décalé de 1 par rapport à l'index de la ligne dans le tableau HTML
    
    if (casesCoches[index]) {
      lignesEnregistrees.splice(i, 1);
    }
  }
  
  localStorage.setItem("candidatures", JSON.stringify(lignesEnregistrees));
}

window.addEventListener("DOMContentLoaded", function() {
  // Récupérer les données du localStorage et les afficher dans le tableau
  var lignesEnregistrees = JSON.parse(localStorage.getItem("candidatures")) || [];
  var tableau = document.getElementById("tableau");
  
  for (var i = 0; i < lignesEnregistrees.length; i++) {
    var ligneEnregistree = lignesEnregistrees[i];
    
    var nouvelleLigne = tableau.insertRow(-1);
    
    var caseACocher = document.createElement("input");
    caseACocher.type = "checkbox";
    nouvelleLigne.insertCell(0).appendChild(caseACocher);
    
    nouvelleLigne.insertCell(1).textContent = ligneEnregistree.nomPoste;
    nouvelleLigne.insertCell(2).textContent = ligneEnregistree.adresseEntreprise;
    nouvelleLigne.insertCell(3).textContent = ligneEnregistree.candidatureEnvoyee;
  }
});
