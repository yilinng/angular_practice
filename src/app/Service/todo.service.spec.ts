import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse, HttpClient, HttpHeaders, HttpProgressEvent } from '@angular/common/http';
import { TodoEntry } from '../types/types'
import { mockTodoArray, mockTodo1, mockTodo2 } from '../../mocks/mockTodos';

//https://www.braydoncoyer.dev/blog/how-to-unit-test-an-http-service-in-angular
describe('todo.service when user no authorized', () => {

 // let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let service: TodoService;
  let httpController: HttpTestingController;
  let endpoint: string = 'http://localhost:4000/api/todos';


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });

    // Inject the http service and test controller for each test
    service = TestBed.inject(TodoService);
    httpController = TestBed.inject(HttpTestingController);
    //httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  });
  /// Tests begin ///

  // After every test, assert that there are no more pending requests.
  afterEach(() => {
    httpController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getTodos and return an array of todos', () => {

    service.getTodos().subscribe((todos) => {
    //  console.log('test get todos', todos);
      expect(todos).toEqual(mockTodoArray)
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: endpoint
    });

    req.flush(mockTodoArray);

    //const testRequest = httpController.expectOne(`${endpoint}`);
    //expect(testRequest.request.method).toBe('GET');

    //testRequest.flush(mockTodoArray)

  });



  it('should call getTodo and return the todo', () => {

    const id = '649b968009fdb51208802255';

    service.getTodo(id).subscribe((todo) => {
     // console.log('get todo service', todo);
      expect(todo).toBeDefined()
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${endpoint}/${id}`
    });

    req.flush(mockTodo1);

    /*
    service.getTodo(id).subscribe((todo) => {
      expect(todo).toBeDefined(); done();},
      (error) => { fail(error.message) } );
    */

    //const testRequest = httpController.expectOne(`${endpoint}/${id}`);

    //expect(testRequest.request.method).toBe('GET');

    //testRequest.flush(mockTodo1);
  })

  it('should call searchTodos return an array of todos', () => {

    const term = 'test1';

    service.searchTodos(term).subscribe((todo) => {
     // console.log('get search todo service', todo);
      expect(todo).toBeDefined()
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${endpoint}/?title=${term}`
    });

    req.flush([mockTodo1, mockTodo2]);

    /*
    service.getTodo(id).subscribe((todo) => {
      expect(todo).toBeDefined(); done();},
      (error) => { fail(error.message) } );
    */

    //const testRequest = httpController.expectOne(`${endpoint}/${id}`);

    //expect(testRequest.request.method).toBe('GET');

    //testRequest.flush(mockTodo1);
  })

});

describe('todo.service when have authorization', () => {

  let httpClient: HttpClient;
  let service: TodoService;
  let httpController: HttpTestingController;
  let endpoint: string = 'http://localhost:4000/api/todos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    service = TestBed.inject(TodoService);
    httpController = TestBed.inject(HttpTestingController);

    spyOn(Storage.prototype, 'getItem').withArgs('access_token').and.returnValue('test');
  });

  // After every test, assert that there are no more pending requests.
  afterEach(() => {
    httpController.verify();
  })

  /// Tests begin ///
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a post in an array', () => {

   // console.log('get item todo service auth', Storage.prototype.getItem('access_token'))

    const newTodo: TodoEntry = {
      "title": "test12 title new",
      "user": "649adaa22f7aaa10a87e8c31",
      "updateDate": "2023-07-16T02:10:08.316Z",
      "content": ["test12 content new"],
      "id": "649b968009fdb51208802255"
    };

    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', "Bearer " + Storage.prototype.getItem('access_token'))

    httpClient.post<TodoEntry>(endpoint, newTodo, { headers: headers })
      .subscribe(todo =>
        // When observable resolves, result should match newTodo
        expect(todo).toEqual(newTodo)
      )

    const testRequest = httpController.expectOne(`${endpoint}`);

  //  console.log('add todo testRequest', testRequest.request);

    expect(testRequest.request.method).toBe('POST');

    expect(testRequest.request.headers.has('Authorization')).toEqual(true);
    expect(testRequest.request.headers.get('Authorization')).toEqual('Bearer test');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    testRequest.flush(newTodo);
    
  });

  it('should delete a post in an array', () => {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', "Bearer " + Storage.prototype.getItem('access_token'));
    let id = '649b968009fdb51208802255';

    httpClient.delete<TodoEntry>(`${endpoint}/${id}`, { headers: headers }).subscribe();

    const testRequest = httpController.expectOne(`${endpoint}/${id}`);

   // console.log('delete todo testRequest', testRequest.request);

    expect(testRequest.request.method).toBe('DELETE');

    expect(testRequest.request.headers.has('Authorization')).toEqual(true);
    expect(testRequest.request.headers.get('Authorization')).toEqual('Bearer test');

    // testRequest.flush()
  });

  it('should update a post in an array', () => {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', "Bearer " + Storage.prototype.getItem('access_token'));
    let id = '649b968009fdb51208802255';

    let updateTodo = {
      "title": "test12 title new update",
      "user": "649adaa22f7aaa10a87e8c31",
      "updateDate": "2023-07-16T02:10:08.316Z",
      "content": ["test12 content new"],
      "id": "649b968009fdb51208802255"
    }

    httpClient.patch<TodoEntry>(`${endpoint}/${id}`, updateTodo, { headers: headers })
      .subscribe((todo) => expect(todo).toBeDefined());

    
    const testRequest = httpController.expectOne(`${endpoint}/${id}`);

   // console.log('update todo testRequest', testRequest.request);
  
    expect(testRequest.request.method).toBe('PATCH');
  
    expect(testRequest.request.headers.has('Authorization')).toEqual(true);
    expect(testRequest.request.headers.get('Authorization')).toEqual('Bearer test');
  });

  it('can test for network error', done => {
    // Create mock ProgressEvent with type `error`, raised when something goes wrong
    // at network level. e.g. Connection timeout, DNS error, offline, etc.
    const mockError = new ProgressEvent('error');

    const testUrl = `${endpoint}`
  
    httpClient.get<TodoEntry[]>(endpoint).subscribe({
      next: () => fail('should have failed with the network error'),
      error: (error: HttpErrorResponse) => {
        expect(error.error).toBe(mockError);
        done();
      },
    });
  
    const req = httpController.expectOne(testUrl);
  
    // Respond with mock error
    req.error(mockError);
  });
})




