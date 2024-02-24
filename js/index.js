class sHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = ` <nav class="navbar bg-info navbar-expand-lg  bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">SportsCrush</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link " aria-current="page" href="index.html">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link " href="map.html">Map</a>
              </li>
              <li class="nav-item">
              <a class="nav-link" href="create_club.html">Create Club</a>
              </li>
              <li class="nav-item">
              <a class="nav-link" href="login.html">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link " href="myprofile.html">My Profile</a>
              </li>
              <li class="nav-item">
              <a class="nav-link" id="myclubs" style="cursor: pointer;">My Clubs</a>
          </li>
          <li class="nav-item">
              <a class="nav-link" id="manageclubs" style="cursor: pointer;">Manage Clubs</a>
          </li>
            </ul>
            <form class="d-flex" role="search">
              <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
              <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>`;
  }
}

customElements.define("s-header", sHeader);
// Wrap the event listener attachment in DOMContentLoaded to ensure the element exists in the DOM
document.addEventListener('DOMContentLoaded', function() {
  // Navigation to myclubs_details.html with type admin
  const myClubsLink = document.getElementById('myclubs');
  const managaeCLubLink = document.getElementById('manageclubs');
  if (myClubsLink) {
      myClubsLink.addEventListener('click', function(event) {
          event.preventDefault(); // Prevent default behavior of the anchor tag
          window.location.href = './myclubs_details.html?type=self'; // Navigate to myclubs_details.html with type=admin
      });
  }
  if (managaeCLubLink) {
    managaeCLubLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default behavior of the anchor tag
        window.location.href = './myclubs_details.html?type=admin'; // Navigate to myclubs_details.html with type=admin
    });
}
});
