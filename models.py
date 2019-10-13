from app import db


class Template(db.Model):
    __tablename__ = 'templates'

    id = db.Column(db.String(), primary_key=True)
    email = db.Column(db.String())
    name = db.Column(db.String())

    def __init__(self, id, email, name):
        self.id = id
        self.email = email
        self.name = name

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name
        }


class Certificate(db.Model):
    __tablename__ = 'certificates'

    id = db.Column(db.String(), primary_key=True)
    template_id = db.Column(db.String())
    name = db.Column(db.String())

    def __init__(self, template_id, name):
        self.template_id = template_id
        self.name = name

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'template_id': self.template_id,
            'name': self.name
        }
