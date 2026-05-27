from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_categoria_service
from app.core.security import get_usuario_atual

from app.modules.funcionario.funcionario_schema import FuncionarioResponse

from app.modules.categoria.categoria_service import CategoriaService
from app.modules.categoria.categoria_schema import CategoriaCreate, CategoriaUpdate, CategoriaResponse, CategoriaInput

router = APIRouter(prefix="/categoria", tags=["Categorias"])


@router.get("/", response_model=list[CategoriaResponse])
def buscar_todas_categorias(
    service: CategoriaService = Depends(get_categoria_service),
    usuario: FuncionarioResponse = Depends(get_usuario_atual)
):
    return service.buscar_todos(usuario)

@router.get("/{id}", response_model=CategoriaResponse)
def buscar_categoria_por_id(
    id: int,
    service: CategoriaService = Depends(get_categoria_service),
    usuario: FuncionarioResponse = Depends(get_usuario_atual)
):
    return service.buscar_por_id(id, usuario)


@router.post("/buscar", response_model=CategoriaResponse)
def buscar_uma_categoria(
    dados: CategoriaInput,
    service: CategoriaService = Depends(get_categoria_service),
    usuario: FuncionarioResponse = Depends(get_usuario_atual)
):
    return service.buscar_uma_categoria(
        usuario_atual=usuario,
        dados = dados
    )
    
    
@router.post("/", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED)
def criar_categoria(
    dados: CategoriaCreate,
    service: CategoriaService = Depends(get_categoria_service),
    usuario: FuncionarioResponse = Depends(get_usuario_atual)
):
    return service.criar_categoria(dados=dados, usuario_atual=usuario)


@router.patch("/{id}", response_model=CategoriaResponse)
def atualizar_categoria( id: int,
    dados_novos: CategoriaUpdate,
    service: CategoriaService = Depends(get_categoria_service),
    usuario: FuncionarioResponse = Depends(get_usuario_atual)
):
    return service.atualizar_categoria(id, dados_novos, usuario)



@router.patch("/{id}/deletar", response_model=CategoriaResponse)

def deletar_categoria(id: int,
        service: CategoriaService = Depends(get_categoria_service),
        usuario: FuncionarioResponse = Depends(get_usuario_atual) ):
    service.deletar_categoria(id, usuario)
    return {"message": "Categoria removida com sucesso"}
