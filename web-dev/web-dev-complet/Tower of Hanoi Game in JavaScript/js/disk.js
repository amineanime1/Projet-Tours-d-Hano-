function Disk(tower, width, colour) {
  this.colour = colour;
  this.width = width;
  this.height = Disk.height;
  this.transfer_to_tower(tower);
}

// Specified as class property so that TowerManager can calculate how high to make towers, based on number of disks.
Disk.height = 20;

Disk.prototype.move_to = function(point) {
  this.position = point;
  this.centre = new Point(this.position.x + this.width/2, this.position.y + this.height/2);
}

Disk.prototype.transfer_to_tower = function(destination) {
  var top_disk = destination.get_top_disk();
  // Do not permit disks wider than tower's existing top disk to transfer to that
  // tower -- in such a case, move the disk back to its original tower.
  if(top_disk && top_disk.width < this.width) destination = this.tower;;

  if(this.tower) this.tower.remove_disk(this);
  this.move_to(new Point(destination.position.x + (destination.base.width - this.width)/2,
                         destination.disks_top - this.height));
  destination.add_disk(this);
  this.tower = destination;

  this.on_disk_transferred();
}
// classe des disques

Disk.prototype.draw = function() {
  // Sauvegarde du contexte de dessin
  this.tower.ctx.save();

  // Dessin du disque
  this.tower.ctx.beginPath();
  var radius = this.height / 4; // Calcul du rayon du bord arrondi
  var x = this.position.x;
  var y = this.position.y;

  // Début du chemin
  this.tower.ctx.moveTo(x + radius, y);
  // Arc du coin supérieur droit
  this.tower.ctx.arcTo(x + this.width, y, x + this.width, y + this.height, radius);
  // Arc du coin inférieur droit
  this.tower.ctx.arcTo(x + this.width, y + this.height, x, y + this.height, radius);
  // Arc du coin inférieur gauche
  this.tower.ctx.arcTo(x, y + this.height, x, y, radius);
  // Arc du coin supérieur gauche
  this.tower.ctx.arcTo(x, y, x + this.width, y, radius);
  // Fin du chemin
  this.tower.ctx.closePath();

  // Remplissage du disque avec la couleur spécifiée
  this.tower.ctx.fillStyle = this.colour;
  this.tower.ctx.fill();

  // Restauration du contexte de dessin
  this.tower.ctx.restore();
}


Disk.prototype.is_clicked_on = function(point) {
  return point.x >= this.position.x              &&
         point.x <  this.position.x + this.width &&
         point.y >= this.position.y              &&
         point.y <  this.position.y + this.height;
}

Disk.prototype.is_top_disk = function() {
  return this == this.tower.get_top_disk();
}

Disk.prototype.toString = function() {
  return 'Disk(width=' + this.width + ', colour=' + this.colour + ')'
}

Disk.prototype.on_disk_transferred = function() { }
