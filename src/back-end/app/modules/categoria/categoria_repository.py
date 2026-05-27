from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import cast

from app.modules.categoria.categoria_model import Categoria


class CategoriaRepository:
    
    def __init__(self, db: Session):
        self.db = db
        
    def registrar_categoria(self, categoria: Categoria):
        self.db.add(categoria)
        self.db.flush()
        return categoria

    def buscar_uma_categoria(self,id: int | None = None,
                             descricao: str | None = None ) -> Categoria | None:

        consulta = select(Categoria)

        if id is not None:
            consulta = consulta.where(Categoria.id == id)

        if descricao is not None:
            consulta = consulta.where(Categoria.descricao == descricao)

        return   self.db.execute(consulta).scalar_one_or_none()

    
    def buscar_por_id(self,categoria_id):
        consulta = select(Categoria).where(Categoria.id==categoria_id)
        return self.db.execute(consulta).scalar_one_or_none()
    
    def buscar_todos(self):
        consulta = select(Categoria)
        return self.db.execute(consulta).scalars().all()
    
    
    
    def atualizar_categoria(self, id: int, dados_novos: dict):
        categoria = cast(Categoria | None, self.db.get(Categoria, id))
        if not categoria:
            return None
        for campo, valor in dados_novos.items():
            if hasattr(categoria, campo):
                setattr(categoria, campo, valor)
        return categoria
    
    
    def deletar_categoria(self, id: int):
        categoria = self.buscar_por_id(id)
        
        if not categoria:
            return False

        self.db.delete(categoria)
        self.db.commit()
        
        return True
    
    