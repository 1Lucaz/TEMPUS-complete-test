from typing import Sequence

from app.modules.categoria.categoria_model import Categoria
from app.modules.categoria.categoria_repository import CategoriaRepository
from app.modules.categoria.categoria_schema import CategoriaCreate, CategoriaUpdate, CategoriaInput
from app.modules.cliente.cliente_schema import ClienteResponse
from app.modules.funcionario.funcionario_schema import FuncionarioResponse

from app.modules.utils.app_exception import Unauthorized, NotFound, BadRequest


class CategoriaService:

    def __init__(self, repository: CategoriaRepository):
        self.repository = repository

    def buscar_todos(self, usuario_atual) -> Sequence[Categoria]:
        if isinstance(usuario_atual, ClienteResponse) or (isinstance(usuario_atual, FuncionarioResponse) and not usuario_atual.access_categoria_servico):
            raise Unauthorized(causa="Você não está autorizado a acessar categorias")

        return self.repository.buscar_todos()

    def buscar_por_id(self, id: int, usuario_atual) -> Categoria:
        if isinstance(usuario_atual, ClienteResponse) or not usuario_atual.access_categoria:
            raise Unauthorized(causa="Você não está autorizado a acessar categorias")

        categoria = self.repository.buscar_por_id(id)

        if categoria is None:
            raise NotFound(causa="Categoria não encontrada")

        return categoria

    def buscar_uma_categoria(
        self,
        usuario_atual,
        dados: CategoriaInput
    ) -> Categoria:

        if isinstance(usuario_atual, ClienteResponse) or not usuario_atual.access_categoria:
            raise Unauthorized(causa="Você não está autorizado a acessar categorias")

        if dados.id is None and dados.descricao is None:
            raise BadRequest(causa="Informe pelo menos um filtro para busca")

        categoria = self.repository.buscar_uma_categoria(
            id=dados.id,
            descricao=dados.descricao
        )

        if categoria is None:
            raise NotFound(causa="Categoria não encontrada")

        return categoria

    def criar_categoria(
        self,
            dados: CategoriaCreate,
            usuario_atual: ClienteResponse | FuncionarioResponse) :

        if isinstance(usuario_atual, ClienteResponse) or not usuario_atual.access_categoria_servico:
            raise Unauthorized(causa="Você não está autorizado a acessar categorias")

        if not dados.descricao or not dados.descricao.strip():
            raise BadRequest(causa="Descrição da categoria é obrigatória")

        categoria_existente = self.repository.buscar_uma_categoria(
            descricao=dados.descricao.strip()
        )

        if categoria_existente:
            raise BadRequest(causa="Já existe uma categoria com essa descrição")

        nova_categoria: Categoria = Categoria (descricao=dados.descricao,
            ativo=dados.ativo,
        )

        return self.repository.registrar_categoria(nova_categoria)

    def atualizar_categoria(
        self,
        id: int,
        dados_novos: CategoriaUpdate,
        usuario_atual
    ) -> Categoria:

        if isinstance(usuario_atual, ClienteResponse) or not usuario_atual.access_categoria:
            raise Unauthorized(causa="Você não está autorizado a acessar categorias")

        dados = dados_novos.model_dump(exclude_unset=True)

        if not dados:
            raise BadRequest(causa="Nenhum dado informado para atualização")


        campos_permitidos = {"descricao", "ativo"}
        dados_filtrados = {
            k: v for k, v in dados.items() if k in campos_permitidos
        }

        if not dados_filtrados:
            raise BadRequest(causa="Nenhum campo válido para atualização")

        categoria = self.repository.atualizar_categoria(
            id=id,
            dados_novos=dados_filtrados
        )

        if categoria is None:
            raise NotFound(causa="Categoria não encontrada")

        return categoria

    def deletar_categoria(
        self,
        id: int,
        usuario_atual
    ) -> bool:

        if isinstance(usuario_atual, ClienteResponse) or not usuario_atual.access_categoria:
            raise Unauthorized(causa="Você não está autorizado a acessar categorias")

        categoria_deletar = self.repository.deletar_categoria(id)

        if not categoria_deletar:
            raise NotFound(causa="Categoria não encontrada")

        return True